# Auth Service

Handles authentication logic including:

- User registration (`POST /auth/register`)
- User login (`POST /auth/login`)
- JWT token generation

## 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```
### 🔐 Environment Variables

Create a .env file:
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/auth-db
JWT_SECRET=your-secret
```

### Test
```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3000/api