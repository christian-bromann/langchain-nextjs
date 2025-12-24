# PRD – Functional Requirements

## WhatsApp Integration (WAHA)
- Receive incoming messages
- Extract WhatsApp ID and message text
- Send text-based responses

## Authentication
- Google OAuth 2.0
- Minimal scopes:
  - calendar.events
  - calendar.readonly
- Refresh token handling

## Session Management
- One session per WhatsApp ID
- Auto-refresh expired tokens
- Silent re-authentication

## NLP & AI
- LangChain JS tool-calling agent
- Ask clarification for ambiguous inputs
- Confirm destructive actions

## Calendar Capabilities (MVP)
| Feature | Supported |
|------|-----------|
| Create event | Yes |
| List events | Yes |
| Update event | Yes |
| Delete event | Yes |
| Recurring events | No |
| Guests | No |
