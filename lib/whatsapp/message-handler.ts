import { getWahaClient } from "@/lib/waha/waha-client";
import { WahaWebhookPayload } from "@/app/api/whatsapp/webhook/types";

export interface ProcessedMessage {
    from: string;
    text: string;
    session: string;
    timestamp: number;
}

/**
 * Extract and normalize message data from webhook payload
 */
export function extractMessage(payload: WahaWebhookPayload): ProcessedMessage | null {
    const whatsappId = payload.payload?.from;
    const messageText = payload.payload?.body;
    const session = payload.session || "default";

    if (!whatsappId || !messageText) {
        return null;
    }

    return {
        from: whatsappId,
        text: messageText,
        session,
        timestamp: payload.timestamp || Date.now(),
    };
}

/**
 * Send a WhatsApp message reply
 */
export async function sendWhatsAppReply(
    to: string,
    text: string,
    session: string = "default"
): Promise<void> {
    const client = getWahaClient();

    await client.sendText({
        session,
        chatId: to,
        text,
    });
}

/**
 * Process incoming WhatsApp message with your business logic
 * This is where you'd integrate with your LangChain agent or other services
 */
export async function processWhatsAppMessage(message: ProcessedMessage): Promise<string> {
    // TODO: Integrate with your LangChain agent here
    // For now, just echo the message
    console.log(`Processing message from ${message.from}: ${message.text}`);

    // Example: You could call your agent like this:
    // const response = await basicAgent({
    //     input: { messages: [{ role: "user", content: message.text }] },
    //     apiKey: process.env.OPENROUTER_API_KEY!,
    //     config: { configurable: { thread_id: message.from } }
    // });

    return `Received: ${message.text}`;
}
