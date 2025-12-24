# TRD – Authentication & Session

## Identity Model
- WhatsApp ID is the primary user identifier
- One Google account per WhatsApp ID

## Login Flow
1. Incoming WhatsApp message
2. Check user + OAuth tokens
3. If missing or expired:
   - Send login link
4. Google OAuth callback
5. Store tokens and activate session

## Session Handling
- No JWT required
- Session state stored in database
- Silent token refresh
