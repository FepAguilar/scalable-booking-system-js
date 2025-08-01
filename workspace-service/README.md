# Workspace Service

Manages user profile data like full name, email, and role.

### 📦 Endpoints

- `POST /workspaces`
- `GET /workspaces`

### 🛠 Setup

```bash
npm install
npx prisma migrate dev
npm run start:dev
```

### 🔐  Environment Variables

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/workspace-db
PORT=3002
``` 

### 🧪 Tests

```bash
npm run test
```

### 📚 Swagger
Once running:
http://localhost:3002/api/docs