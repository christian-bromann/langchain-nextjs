# TRD – External Integrations

## WhatsApp (WAHA)

### Incoming Webhook
- Method: POST
- Content-Type: application/json

Example payload:
```json
{
  "sender": { "id": "62812xxxx" },
  "message": { "text": "Create meeting tomorrow at 9" },
  "timestamp": 1710000000
}
```

### Outgoing Messages

- Text-based replies
- Login link messages
- Error and confirmation messages

### Google OAuth 2.0
Scopes (MVP)
- https://www.googleapis.com/auth/calendar
- https://www.googleapis.com/auth/calendar.events

### Token Strategy
- Access token stored temporarily
- Refresh token stored encrypted
- Auto-refresh before tool execution


---

## 📘 `trd-backend-design.md`

```md
# TRD – Backend Design

## Framework
- Next.js (App Router)
- Node.js runtime

## API Route Structure

/api
├── whatsapp/webhook
├── auth/google/login
├── auth/google/callback
└── agent/execute

## Responsibilities
- Validate WhatsApp identity
- Handle OAuth lifecycle
- Execute LangChain agent
- Return formatted responses