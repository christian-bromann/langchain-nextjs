# WAHA Client Library

This directory contains the auto-generated TypeScript client for the WAHA (WhatsApp HTTP API) service.

## Files

- `waha.ts` - Auto-generated TypeScript client library with types and methods
- `waha-client.ts` - Singleton factory for WahaClient (recommended)
- `../scripts/generate-waha-client.ts` - Script that generates the client from OpenAPI spec
- `../waha-swagger.json` - OpenAPI specification for WAHA API

## Usage

### Using the Singleton Factory (Recommended)

The recommended way to use the WAHA client is through the singleton factory:

```typescript
import { getWahaClient } from '@/lib/waha-client';

// Get the singleton instance (automatically configured from env vars)
const client = getWahaClient();

// Send a text message
await client.sendText({
  session: 'default',
  chatId: '1234567890@c.us',
  text: 'Hello from WAHA!',
});
```

### Using the WahaClient Class Directly

```typescript
import { WahaClient } from '@/lib/waha';

const client = new WahaClient({
  baseUrl: process.env.NEXT_PUBLIC_WAHA_API_URL!,
  apiKey: process.env.NEXT_PUBLIC_WAHA_API_KEY!,
});

// Send a text message
await client.sendText({
  session: 'default',
  chatId: '1234567890@c.us',
  text: 'Hello from WAHA!',
});

// Send an image
await client.sendImage({
  session: 'default',
  chatId: '1234567890@c.us',
  file: {
    mimetype: 'image/jpeg',
    filename: 'photo.jpg',
    url: 'https://example.com/photo.jpg',
  },
});

// Get all sessions
const sessions = await client.getSessions();
```

### Using the Helper Function (Backward Compatible)

```typescript
import { sendWhatsappMessage } from '@/lib/waha';

await sendWhatsappMessage('default', '1234567890@c.us', 'Hello!');
```

## Available Methods

The `WahaClient` class provides the following methods:

- `sendText(data)` - Send a text message
- `sendImage(data)` - Send an image
- `sendFile(data)` - Send a file
- `sendVoice(data)` - Send a voice message
- `sendVideo(data)` - Send a video
- `sendLocation(data)` - Send a location
- `sendLinkPreview(data)` - Send a link preview
- `sendSeen(data)` - Mark messages as seen
- `startTyping(data)` - Show typing indicator
- `stopTyping(data)` - Hide typing indicator
- `getSessions()` - List all sessions
- `createSession(data)` - Create a new session

## TypeScript Types

All request and response types are automatically generated from the OpenAPI spec, including:

- `MessageTextRequest`
- `MessageImageRequest`
- `MessageFileRequest`
- `WAMessage`
- `SessionInfo`
- And many more...

## Regenerating the Client

If the WAHA API is updated and you have a new `waha-swagger.json` file:

```bash
# Run the generation script
pnpm generate:waha

# Or manually
pnpm tsx scripts/generate-waha-client.ts
```

This will regenerate `lib/waha.ts` with the latest types and methods from the OpenAPI specification.

## Notes

- The generated file should **not be edited manually** as it will be overwritten when regenerated
- All customizations should be made in the generation script (`scripts/generate-waha-client.ts`)
- The helper function `sendWhatsappMessage` is included for backward compatibility with existing code
