# TRD – Database Design (MVP)

## Database
- PostgreSQL
- ORM: Prisma

## User Model
- id (UUID)
- whatsappId (unique)
- createdAt

## OAuthAccount Model
- id
- userId (FK)
- accessToken
- refreshToken (encrypted)
- expiresAt
- scope

## Optional Tables
- MessageLog (for debugging & analytics)
