# PRD – Technical Architecture

## High-Level Architecture

WhatsApp User
↓
WAHA Webhook
↓
Next.js API
- Auth Service
- Session Manager
- LangChain Agent
- Google Calendar Tool
- PostgreSQL

## Backend Stack
- Node.js
- Next.js (App Router)
- LangChain JS
- Prisma ORM
- PostgreSQL

## Design Principles
- Stateless API per request
- Tokens injected dynamically
- Fail gracefully
