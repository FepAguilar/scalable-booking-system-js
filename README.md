# scalable-booking-system-js

This project is a modular, microservice-based backend system for managing a co-working space platform. Built with NestJS, PostgreSQL, and Docker.

## 📦 Services

### 🔐 [auth-service](./auth-service)
Handles user registration, login, and JWT-based authentication.

### 👤 [user-service](./user-service)
Stores user profile information such as full name, role, and email.

### 🏢 [workspace-service](./workspace-service)  
Manages workspace data such as name and description.

### 📅 [booking-service](./booking-service)
Handles workspace booking lifecycle (create, list, confirm, cancel, reschedule, delete). **Orchestrates other services** for user validation, workspace validation, payment processing, notifications, and reporting.

### 💳 [payment-service](./payment-service)
Processs payments related to bookings.

### 🔔 [notification-service](./notification-service)
Sends and stores notifications related to bookings and users.

### 📊 [reporting-service](./reporting-service)
Generates and manages reports for the platform.

### 👨‍💼 [admin-service](./admin-service)
Manages admin users and platform administration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- PostgreSQL (or Dockerized DB)

### Start All Services
```bash
# Start PostgreSQL
docker compose up -d postgres

# Start all services with development script
./dev.sh start all

# Check service status
./dev.sh status
```

### Individual Service Management
```bash
# Start specific service
./dev.sh start booking-service

# View service logs
./dev.sh logs booking-service

# Stop specific service
./dev.sh stop booking-service

# Restart service
./dev.sh restart booking-service
```

## 🔄 Inter-Service Communication

Our system uses HTTP REST APIs for service-to-service communication. The booking service orchestrates the complete booking flow:

1. **User Validation** → `user-service`
2. **Workspace Validation** → `workspace-service`  
3. **Booking Creation** → `booking-service`
4. **Payment Processing** → `payment-service`
5. **Notifications** → `notification-service`
6. **Reporting** → `reporting-service`

See [INTERSERVICE_COMMUNICATION.md](./INTERSERVICE_COMMUNICATION.md) for detailed architecture.

## 🌐 Service URLs

| Service | URL | Swagger Docs |
|---------|-----|--------------|
| Auth Service | http://localhost:3000 | http://localhost:3000/api |
| User Service | http://localhost:3001 | http://localhost:3001/api/docs |
| Workspace Service | http://localhost:3002 | http://localhost:3002/api/docs |
| Booking Service | http://localhost:3003 | http://localhost:3003/api/docs |
| Payment Service | http://localhost:3004 | http://localhost:3004/api/docs |
| Notification Service | http://localhost:3005 | http://localhost:3005/api/docs |
| Reporting Service | http://localhost:3006 | http://localhost:3006/api/docs |
| Admin Service | http://localhost:3007 | http://localhost:3007/api/docs |

## 🧪 Testing

### Manual Testing Flow
1. Start all services: `./dev.sh start all`
2. Create a user via user-service
3. Create a workspace via workspace-service  
4. Create a booking via booking-service
5. Verify payment, notification, and reporting services received data

### Unit Testing
Each service includes isolated unit tests with Jest and ts-jest:
```bash
# Run tests for specific service
cd booking-service && npm test

# Run all tests
find . -name "package.json" -execdir npm test \;
```

## 📁 Project Structure

```
scalable-booking-system-js/
├── auth-service/          # Authentication & JWT
├── user-service/          # User profiles
├── workspace-service/     # Workspace management
├── booking-service/       # Booking orchestration
├── payment-service/       # Payment processing
├── notification-service/  # Notifications
├── reporting-service/     # Analytics & reports
├── admin-service/         # Admin dashboard
├── dev.sh                # Development orchestration
├── docker-compose.yml    # Database setup
└── INTERSERVICE_COMMUNICATION.md
```

## 🔧 Development

### Adding New Services
1. Create service with `nest new service-name` (skip git)
2. Follow existing patterns (Prisma, DTOs, controllers, tests)
3. Add to `dev.sh` script
4. Update this README

### Environment Variables
Each service has its own `.env` file with:
- `DATABASE_URL` - PostgreSQL connection
- `PORT` - Service port
- External service URLs (for inter-service communication)

### Database Setup
```bash
# Start PostgreSQL
docker compose up -d postgres

# Run migrations for each service
cd booking-service && npx prisma migrate dev
cd ../payment-service && npx prisma migrate dev
# ... repeat for all services
```

## 🎯 Project Goals
- Scalable modular architecture
- Microservice boundaries with clear responsibilities
- Domain-driven folder structures
- Production-ready patterns
- Inter-service communication with proper error handling
- Comprehensive testing and documentation

## 📚 Documentation
- [Inter-Service Communication](./INTERSERVICE_COMMUNICATION.md) - Detailed architecture guide
- Individual service READMEs for specific setup instructions
- Swagger documentation available at each service's `/api/docs` endpoint