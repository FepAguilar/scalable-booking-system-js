# Payment Service

Processes payments related to bookings.

### 📦 Endpoints

- `POST /payments`
- `GET /payments`

### 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 🔐  Environment Variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/payment_service
PORT=3004
```

### 🧪 Tests

```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3004/api/docs