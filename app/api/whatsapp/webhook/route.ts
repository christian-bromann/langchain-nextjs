import { NextRequest, NextResponse } from "next/server";
import {
    WahaWebhookPayload,
    WebhookResponse,
    WebhookSuccessResponse,
    WebhookSkippedResponse,
    WebhookErrorResponse
} from "./types";
import { extractMessage, processWhatsAppMessage, sendWhatsAppReply } from "@/lib/whatsapp/message-handler";
import { createAuthDeepLink } from "@/lib/google";

export async function POST(req: NextRequest): Promise<NextResponse<WebhookResponse>> {
    try {
        const payload = (await req.json()) as WahaWebhookPayload;

        // Extract message from payload
        const message = extractMessage(payload);

        if (!message) {
            console.log("⚠️ Could not extract sender or message from payload");
            const response: WebhookSkippedResponse = {
                success: true,
                skipped: true,
                reason: "Missing sender ID or message text"
            };
            return NextResponse.json(response);
        }

        console.log(`📩 Message from ${message.from} on session ${message.session}: ${message.text}`);

        // Process the message (this is where you can integrate with your agent)
        const authUrl = await createAuthDeepLink(message.from);
        await sendWhatsAppReply(message.from, `Please connect your Google account: ${authUrl}`, 'default')

        const response: WebhookSuccessResponse = {
            success: true,
            message: "Message received and queued for processing",
            data: {
                from: message.from,
                messageReceived: message.text,
                session: message.session
            }
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("Webhook error:", error);
        const response: WebhookErrorResponse = {
            success: false,
            error: "Failed to process webhook",
            details: error instanceof Error ? error.message : String(error)
        };
        return NextResponse.json(response, { status: 500 });
    }
}
