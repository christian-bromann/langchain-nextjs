# PRD – Database Schema (MVP)

## User
- id (UUID)
- whatsappId (string, unique)
- createdAt

## OAuthAccount
- id
- userId (FK)
- accessToken
- refreshToken (encrypted)
- expiresAt
- scope

## MessageLog (Optional)
- id
- userId
- message
- response
- createdAt
