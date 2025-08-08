# Inter-Service Communication Architecture

## Overview

Our scalable booking system uses HTTP REST APIs for inter-service communication, with plans to migrate to RabbitMQ for asynchronous messaging in the future.

## Service Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │   User Service  │    │ Workspace      │
│   (Port 3000)   │    │   (Port 3001)   │    │ Service        │
│                 │    │                 │    │ (Port 3002)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Booking Service│
                    │   (Port 3003)   │
                    │                 │
                    └─────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Payment Service │    │ Notification    │    │ Reporting       │
│  (Port 3004)    │    │ Service         │    │ Service         │
│                 │    │ (Port 3005)     │    │ (Port 3006)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Admin Service  │
                    │   (Port 3007)   │
                    │                 │
                    └─────────────────┘
```

## Business Flow

### Booking Creation Flow

1. **User Authentication** → `auth-service`
2. **User Validation** → `user-service` (validate user exists)
3. **Workspace Validation** → `workspace-service` (validate workspace exists)
4. **Booking Creation** → `booking-service` (create booking with overlap validation)
5. **Payment Processing** → `payment-service` (create payment record)
6. **Notification** → `notification-service` (send confirmation email)
7. **Reporting** → `reporting-service` (log booking activity)

### Service Responsibilities

| Service | Primary Responsibility | External Dependencies |
|---------|----------------------|----------------------|
| `auth-service` | Authentication & JWT tokens | None |
| `user-service` | User profile management | None |
| `workspace-service` | Workspace management | None |
| `booking-service` | Booking lifecycle | user, workspace, payment, notification, reporting |
| `payment-service` | Payment processing | None |
| `notification-service` | Email/SMS notifications | None |
| `reporting-service` | Analytics & reporting | None |
| `admin-service` | Admin dashboard | All services |

## Implementation Details

### HTTP Client Configuration

Each service that needs to communicate with others includes:

```typescript
// config/services.config.ts
export const SERVICES_CONFIG = {
  user: {
    baseUrl: process.env.USER_SERVICE_URL || "http://localhost:3001",
    endpoints: {
      findById: "/user",
    },
  },
  // ... other services
};
```

### External Service Pattern

```typescript
// services/external.service.ts
@Injectable()
export class ExternalService {
  private readonly httpClient: AxiosInstance;

  async validateUser(userId: string): Promise<boolean> {
    try {
      const response = await this.httpClient.get(
        `${SERVICES_CONFIG.user.baseUrl}${SERVICES_CONFIG.user.endpoints.findById}/${userId}`
      );
      return response.status === 200;
    } catch (error) {
      throw new HttpException("User not found", HttpStatus.BAD_REQUEST);
    }
  }
}
```

### Error Handling Strategy

- **Critical Dependencies**: Throw exceptions (user, workspace validation)
- **Non-Critical Dependencies**: Log errors but don't fail (notifications, reporting)
- **Timeout Configuration**: 5-second timeout for all HTTP calls
- **Circuit Breaker**: Future implementation with RabbitMQ

## Development Commands

### Start All Services

```bash
./dev.sh start all
```

### Start Individual Service

```bash
./dev.sh start booking-service
```

### Check Service Status

```bash
./dev.sh status
```

### View Service Logs

```bash
./dev.sh logs booking-service
```

### Stop All Services

```bash
./dev.sh stop all
```

## Environment Variables

Each service can configure external service URLs:

```bash
# booking-service/.env
USER_SERVICE_URL=http://localhost:3001
WORKSPACE_SERVICE_URL=http://localhost:3002
PAYMENT_SERVICE_URL=http://localhost:3004
NOTIFICATION_SERVICE_URL=http://localhost:3005
REPORTING_SERVICE_URL=http://localhost:3006
```

## Future Enhancements

### RabbitMQ Integration

```typescript
// Planned implementation
@Injectable()
export class MessageQueueService {
  async publishBookingCreated(booking: Booking): Promise<void> {
    await this.amqpConnection.publish('bookings', 'booking.created', booking);
  }
}
```

### Service Discovery

```typescript
// Planned implementation
@Injectable()
export class ServiceDiscovery {
  async getServiceUrl(serviceName: string): Promise<string> {
    // Consul/Eureka integration
  }
}
```

### API Gateway

```typescript
// Planned implementation
@Controller('api/v1')
export class ApiGatewayController {
  @Post('bookings')
  async createBooking(@Body() dto: CreateBookingDto) {
    // Route to booking-service with auth validation
  }
}
```

## Testing Inter-Service Communication

### Manual Testing

1. Start all services: `./dev.sh start all`
2. Create a user via user-service
3. Create a workspace via workspace-service
4. Create a booking via booking-service
5. Verify payment, notification, and reporting services received data

### Automated Testing

```typescript
// booking.service.spec.ts
describe('BookingService', () => {
  it('should validate user before creating booking', async () => {
    // Mock external service calls
    jest.spyOn(externalService, 'validateUser').mockResolvedValue(true);
    // Test booking creation
  });
});
```

## Monitoring & Observability

### Logging

Each service logs external service calls:

```typescript
this.logger.error(`Failed to validate user ${userId}:`, errorMessage);
```

### Metrics (Future)

- HTTP call latency
- Success/failure rates
- Circuit breaker status

### Health Checks

Each service exposes health endpoints:

```bash
curl http://localhost:3003/health
curl http://localhost:3004/health
# etc.
```

## Security Considerations

### Service-to-Service Authentication

Currently using simple HTTP calls. Future implementation:

```typescript
// Planned JWT-based service authentication
const response = await this.httpClient.get(url, {
  headers: {
    'Authorization': `Bearer ${serviceToken}`,
    'X-Service-Name': 'booking-service'
  }
});
```

### Rate Limiting

Future implementation per service:

```typescript
// Planned rate limiting
@UseGuards(ThrottlerGuard)
@Throttle(100, 60) // 100 requests per minute
```

## Troubleshooting

### Common Issues

1. **Service Unavailable**: Check if target service is running
2. **Timeout Errors**: Increase timeout or check network
3. **Validation Failures**: Ensure data exists in target service

### Debug Commands

```bash
# Check all service status
./dev.sh status

# View specific service logs
./dev.sh logs booking-service

# Restart specific service
./dev.sh restart booking-service
``` 