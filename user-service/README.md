# User Service

Manages user profile data like full name, email, and role.

### 📦 Endpoints

- `POST /user`
- `GET /user/:id`

### 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 🔐  Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/user-db
PORT=3001
``` 

### 🧪 Tests

```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3000/api