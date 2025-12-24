# WhatsApp Message Handler

This module handles incoming WhatsApp messages from the WAHA webhook and provides hooks for processing them with your business logic.

## Architecture

```
Webhook receives message
    ↓
extractMessage() - Normalizes payload
    ↓
processWhatsAppMessage() - Your business logic here
    ↓
(Optional) sendWhatsAppReply() - Send response
```

## Files

- `message-handler.ts` - Core message processing logic
- `../app/api/whatsapp/webhook/route.ts` - Webhook endpoint
- `../app/api/whatsapp/webhook/types.ts` - TypeScript types

## Usage

### Processing Messages

The `processWhatsAppMessage()` function in `message-handler.ts` is where you integrate your business logic:

```typescript
export async function processWhatsAppMessage(message: ProcessedMessage): Promise<string> {
    // Integrate with your LangChain agent
    const response = await basicAgent({
        input: { 
            messages: [{ role: "user", content: message.text }] 
        },
        apiKey: process.env.OPENROUTER_API_KEY!,
        config: { 
            configurable: { 
                thread_id: message.from  // Use WhatsApp ID as thread ID
            } 
        }
    });
    
    // Send reply back to user
    await sendWhatsAppReply(message.from, response, message.session);
    
    return response;
}
```

### Sending Replies

Use the `sendWhatsAppReply()` helper function:

```typescript
import { sendWhatsAppReply } from "@/lib/whatsapp/message-handler";

await sendWhatsAppReply(
    "1234567890@c.us",  // WhatsApp ID
    "Hello! How can I help?",  // Message text
    "default"  // Session name (optional)
);
```

### Message Structure

The `ProcessedMessage` interface provides normalized message data:

```typescript
interface ProcessedMessage {
    from: string;        // WhatsApp ID (e.g., "1234567890@c.us")
    text: string;        // Message text
    session: string;     // WAHA session name
    timestamp: number;   // Unix timestamp
}
```

## Integration Examples

### Example 1: Echo Bot

```typescript
export async function processWhatsAppMessage(message: ProcessedMessage): Promise<string> {
    const reply = `You said: ${message.text}`;
    await sendWhatsAppReply(message.from, reply, message.session);
    return reply;
}
```

### Example 2: LangChain Agent

```typescript
import { basicAgent } from "@/app/api/basic/agent";

export async function processWhatsAppMessage(message: ProcessedMessage): Promise<string> {
    // Call your LangChain agent
    const agentResponse = await basicAgent({
        input: { 
            messages: [{ role: "user", content: message.text }] 
        },
        apiKey: process.env.OPENROUTER_API_KEY!,
        config: { 
            configurable: { 
                thread_id: message.from  // Maintains conversation context per user
            } 
        }
    });
    
    // Extract response and send back
    const responseText = await extractResponseText(agentResponse);
    await sendWhatsAppReply(message.from, responseText, message.session);
    
    return responseText;
}
```

### Example 3: Queue for Background Processing

```typescript
import { queueJob } from "@/lib/queue";

export async function processWhatsAppMessage(message: ProcessedMessage): Promise<string> {
    // Queue the message for background processing
    await queueJob("process-whatsapp-message", {
        from: message.from,
        text: message.text,
        session: message.session,
    });
    
    // Send immediate acknowledgment
    await sendWhatsAppReply(
        message.from, 
        "Got it! I'm processing your request...",
        message.session
    );
    
    return "Queued for processing";
}
```

## Webhook Response Types

The webhook returns typed responses:

**Success:**
```json
{
  "success": true,
  "message": "Message received and queued for processing",
  "data": {
    "from": "1234567890@c.us",
    "messageReceived": "Hello!",
    "session": "default"
  }
}
```

**Skipped:**
```json
{
  "success": true,
  "skipped": true,
  "reason": "Missing sender ID or message text"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Failed to process webhook",
  "details": "Error message here"
}
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_WAHA_API_URL=http://localhost:3000
NEXT_PUBLIC_WAHA_API_KEY=your-api-key
OPENROUTER_API_KEY=your-openrouter-key  # For LangChain agent
NEXT_PUBLIC_DB_URI=postgresql://...  # For conversation persistence
```

## Next Steps

1. **Implement your business logic** in `processWhatsAppMessage()`
2. **Integrate with your LangChain agent** for AI-powered responses
3. **Add conversation context** using the WhatsApp ID as thread ID
4. **Handle different message types** (images, files, etc.)
5. **Add rate limiting** and error handling as needed
