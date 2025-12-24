# TRD – System Architecture

## High-Level Flow

WhatsApp User
↓
WAHA Webhook
↓
Next.js API (Webhook Handler)
↓
Authentication & Session Check
↓
LangChain Agent
↓
Google Calendar API
↓
WAHA Response

## Architecture Principles
- Stateless API per request
- Tokens injected dynamically
- Fail gracefully
- Ask before acting
