# Notification Service

Sends and stores notifications related to bookings and users.

### 📦 Endpoints

- `POST /notifications`
- `GET /notifications`

### 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 🔐  Environment Variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/notification_service
PORT=3005
```

### 🧪 Tests

```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3005/api/docs