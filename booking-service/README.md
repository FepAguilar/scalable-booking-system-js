# Booking Service

Handles workspace booking lifecycle (create, list, confirm, cancel, reschedule, delete).

### 📦 Endpoints

- `POST /bookings`
- `GET /bookings`
- `GET /bookings/:id`
- `PATCH /bookings/:id`
- `POST /bookings/:id/confirm`
- `POST /bookings/:id/cancel`
- `DELETE /bookings/:id`

### 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 🔐  Environment Variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5434/booking_service?schema=public
PORT=3003
```

### 🧪 Tests

```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3003/api/docs