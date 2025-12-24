# TRD – Deployment & Testing

## Environment Variables

GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
DATABASE_URL
WAHA_API_URL
WAHA_API_KEY

## Performance Targets
- WhatsApp response < 5s
- OAuth callback < 3s
- Tool execution < 2s

## Testing Strategy
- OAuth flow testing
- Calendar CRUD testing
- Token refresh testing
- Webhook integration testing

## Definition of Done (Technical)
- OAuth works end-to-end
- Calendar CRUD via WhatsApp
- Agent selects correct tools
- Errors handled gracefully
