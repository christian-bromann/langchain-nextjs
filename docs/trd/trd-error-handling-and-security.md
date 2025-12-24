# TRD – Error Handling & Security

## Error Handling

| Scenario | Handling |
|--------|----------|
| Not authenticated | Send login link |
| Token expired | Silent refresh |
| Ambiguous command | Ask clarification |
| API failure | Friendly retry message |

## Security Requirements
- HTTPS only
- Encrypt refresh tokens
- Minimal OAuth scopes
- Rate limit webhook endpoint
- Validate WAHA webhook source
