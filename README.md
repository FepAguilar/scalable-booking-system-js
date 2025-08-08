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
Handles workspace booking lifecycle (create, list, confirm, cancel, reschedule, delete).

## 🛠️ Getting Started

### Prerequisites
- Node.js
- Docker & Docker Compose
- PostgreSQL (or Dockerized DB)
- pnpm / npm / yarn

### Running All Services (individually)
```bash
# From each service folder
npm install
npm run start:dev
```

### Testing 
Each service includes isolated unit tests with Jest and ts-jest.

### Project Goals
- Scalable modular architecture
- Microservice boundaries
- Domain-driven folder structures
- Production-ready patterns