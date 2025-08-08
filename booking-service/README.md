# Booking Service

NestJS microservice for managing bookings.

## Development

- Install: `npm install`
- Run dev: `npm run start:dev`
- Swagger: `http://localhost:3003/api/docs`

## Prisma

- Set `DATABASE_URL` in `.env`
- Generate client: `npx prisma generate`
- Create migration: `npx prisma migrate dev --name init`
- Open studio: `npx prisma studio`