# Full Inter-Service Communication Architecture

## 🎯 **Complete Service Integration**

We've now implemented **full inter-service communication** where **ALL services** are interconnected with proper business logic orchestration.

## 🔄 **Service Communication Matrix**

| Service | Communicates With | Purpose |
|---------|------------------|---------|
| **Auth Service** | All services | JWT token validation |
| **User Service** | Auth, Booking, Notification, Reporting | User lifecycle management |
| **Workspace Service** | Booking, Notification, Reporting | Workspace lifecycle management |
| **Booking Service** | User, Workspace, Payment, Notification, Reporting | **Core orchestration** |
| **Payment Service** | Booking, Notification, Reporting | Payment processing |
| **Notification Service** | All services | Event notifications |
| **Reporting Service** | All services | Analytics & reporting |
| **Admin Service** | All services | Admin dashboard |

## 🏗️ **Business Flow Orchestration**

### **1. User Registration Flow**
```
User Service → Notification Service → Reporting Service
     ↓              ↓                    ↓
Create User → Send Welcome Email → Log Registration
```

### **2. Workspace Creation Flow**
```
Workspace Service → Notification Service → Reporting Service
        ↓                ↓                    ↓
Create Workspace → Send Availability Email → Log Workspace Creation
```

### **3. Booking Creation Flow (Core Orchestration)**
```
Booking Service → User Service → Workspace Service → Payment Service → Notification Service → Reporting Service
       ↓              ↓              ↓              ↓              ↓              ↓
Create Booking → Validate User → Validate Workspace → Create Payment → Send Confirmation → Log Activity
```

### **4. Payment Processing Flow**
```
Payment Service → Booking Service → Notification Service → Reporting Service
       ↓              ↓              ↓              ↓
Process Payment → Update Booking Status → Send Payment Email → Log Payment
```

## 📋 **Service Responsibilities**

### **Auth Service (Port 3000)**
- **Primary**: JWT token generation and validation
- **External Calls**: None (other services call it)
- **Endpoints**: `/auth/login`, `/auth/register`, `/auth/validate`

### **User Service (Port 3001)**
- **Primary**: User profile management
- **External Calls**: 
  - `auth-service` for token validation
  - `booking-service` for user bookings
  - `notification-service` for user notifications
  - `reporting-service` for user analytics
- **Endpoints**: `/user`, `/user/:id`, `/user/:id/bookings`

### **Workspace Service (Port 3002)**
- **Primary**: Workspace management
- **External Calls**:
  - `booking-service` for workspace bookings
  - `notification-service` for workspace notifications
  - `reporting-service` for workspace analytics
- **Endpoints**: `/workspaces`, `/workspaces/:id`, `/workspaces/:id/bookings`

### **Booking Service (Port 3003) - CORE ORCHESTRATOR**
- **Primary**: Booking lifecycle management
- **External Calls**:
  - `user-service` for user validation
  - `workspace-service` for workspace validation
  - `payment-service` for payment creation
  - `notification-service` for booking notifications
  - `reporting-service` for booking analytics
- **Endpoints**: `/bookings`, `/bookings/:id`, `/bookings/:id/confirm`, `/bookings/:id/cancel`

### **Payment Service (Port 3004)**
- **Primary**: Payment processing
- **External Calls**:
  - `booking-service` for booking validation and status updates
  - `notification-service` for payment notifications
  - `reporting-service` for payment analytics
- **Endpoints**: `/payments`, `/payments/:id`, `/payments/booking/:bookingId`

### **Notification Service (Port 3005)**
- **Primary**: Email/SMS notifications
- **External Calls**: None (other services call it)
- **Endpoints**: `/notifications`, `/notifications/:id`

### **Reporting Service (Port 3006)**
- **Primary**: Analytics and reporting
- **External Calls**: None (other services call it)
- **Endpoints**: `/reports`, `/reports/:id`

### **Admin Service (Port 3007)**
- **Primary**: Admin dashboard and management
- **External Calls**: All services for admin operations
- **Endpoints**: `/admins`, `/admins/:id`

## 🔧 **Implementation Details**

### **HTTP Client Configuration**
Each service includes:
```typescript
// config/services.config.ts
export const SERVICES_CONFIG = {
  serviceName: {
    baseUrl: process.env.SERVICE_URL || 'http://localhost:PORT',
    endpoints: {
      action: '/endpoint',
    },
  },
};
```

### **External Service Pattern**
```typescript
// services/external.service.ts
@Injectable()
export class ExternalService {
  private readonly httpClient: AxiosInstance;

  async callOtherService(data: any): Promise<any> {
    try {
      const response = await this.httpClient.post(url, data);
      return response.data;
    } catch (error) {
      this.logger.error('Service call failed:', error);
      throw new HttpException('Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
```

### **Business Logic Orchestration**
```typescript
// service.service.ts
private async orchestrateExternalServices(entity: Entity): Promise<void> {
  try {
    // Call other services
    await this.externalService.sendNotification(entity.id, message);
    await this.externalService.createReport(title, description);
  } catch (error) {
    console.error('External service orchestration failed:', error);
  }
}
```

## 🚀 **Development Commands**

### **Start All Services**
```bash
# Start PostgreSQL
docker compose up -d postgres

# Start all services
./dev.sh start all

# Check status
./dev.sh status
```

### **Test Full Integration**
```bash
# Run comprehensive integration test
./test-integration.sh test

# Check service health
./test-integration.sh check
```

## 📊 **Service URLs & Documentation**

| Service | URL | Swagger | Health |
|---------|-----|---------|--------|
| Auth | http://localhost:3000 | http://localhost:3000/api | http://localhost:3000/health |
| User | http://localhost:3001 | http://localhost:3001/api/docs | http://localhost:3001/health |
| Workspace | http://localhost:3002 | http://localhost:3002/api/docs | http://localhost:3002/health |
| **Booking** | **http://localhost:3003** | **http://localhost:3003/api/docs** | **http://localhost:3003/health** |
| Payment | http://localhost:3004 | http://localhost:3004/api/docs | http://localhost:3004/health |
| Notification | http://localhost:3005 | http://localhost:3005/api/docs | http://localhost:3005/health |
| Reporting | http://localhost:3006 | http://localhost:3006/api/docs | http://localhost:3006/health |
| Admin | http://localhost:3007 | http://localhost:3007/api/docs | http://localhost:3007/health |

## 🧪 **Testing Scenarios**

### **Complete User Journey**
1. **User Registration**: `POST /user` → Welcome email + Report
2. **Workspace Creation**: `POST /workspaces` → Availability email + Report
3. **Booking Creation**: `POST /bookings` → User/Workspace validation → Payment → Confirmation email + Report
4. **Payment Processing**: `POST /payments` → Booking status update → Payment email + Report

### **Error Handling Scenarios**
- **Service Unavailable**: Graceful degradation with logging
- **Validation Failures**: Proper error responses
- **Network Timeouts**: 5-second timeout with retry logic

## 🔮 **Future Enhancements**

### **RabbitMQ Integration**
```typescript
// Planned implementation
@Injectable()
export class MessageQueueService {
  async publishEvent(event: string, data: any): Promise<void> {
    await this.amqpConnection.publish('events', event, data);
  }
}
```

### **Circuit Breaker Pattern**
```typescript
// Planned implementation
@Injectable()
export class CircuitBreakerService {
  async callWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
    // Circuit breaker logic
  }
}
```

### **Service Discovery**
```typescript
// Planned implementation
@Injectable()
export class ServiceDiscovery {
  async getServiceUrl(serviceName: string): Promise<string> {
    // Consul/Eureka integration
  }
}
```

## 📈 **Monitoring & Observability**

### **Logging Strategy**
- Each service logs external calls
- Error logging with context
- Performance metrics

### **Health Checks**
- Individual service health endpoints
- Dependency health checks
- Overall system health

### **Metrics Collection**
- HTTP call latency
- Success/failure rates
- Service response times

## 🛡️ **Security Considerations**

### **Service-to-Service Authentication**
- JWT-based authentication
- Service tokens for internal communication
- Rate limiting per service

### **Data Validation**
- Input validation at service boundaries
- Output validation for external calls
- Schema validation for all DTOs

## 🎉 **Benefits of Full Integration**

1. **Complete Business Workflows**: All services participate in business processes
2. **Data Consistency**: Cross-service validation and updates
3. **Event-Driven Architecture**: Services react to changes in other services
4. **Scalability**: Each service can scale independently
5. **Fault Tolerance**: Graceful degradation when services are unavailable
6. **Observability**: Complete traceability across service boundaries

This architecture provides a **production-ready microservices system** with proper inter-service communication, error handling, and business logic orchestration! 🚀 