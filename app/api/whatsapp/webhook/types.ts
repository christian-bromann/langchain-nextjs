export interface WahaWebhookPayload {
    sender: {
        id: string;
    };
    message?: {
        text?: string;
    };
    timestamp?: number;
    session?: string;
    // Standard WAHA
    payload?: {
        body: string;
        from: string;
        _data?: {
            Info?: {
                Sender: string;
                SenderAlt?: string;
                Chat: string;
                PushName?: string;
            };
        };
    };
    // GOWS / Raw structure
    events?: {
        event: string;
        data?: {
            Info?: {
                Sender: string;
                SenderAlt?: string;
                Chat: string;
                PushName?: string;
            };
            Message?: {
                conversation?: string;
                extendedTextMessage?: {
                    text?: string;
                };
            };
        };
    };
}

export interface WebhookSuccessResponse {
    success: true;
    message: string;
    data?: {
        from: string;
        messageReceived: string;
        session: string;
    };
}

export interface WebhookSkippedResponse {
    success: true;
    skipped: true;
    reason: string;
}

export interface WebhookErrorResponse {
    success: false;
    error: string;
    details?: string;
}

export type WebhookResponse =
    | WebhookSuccessResponse
    | WebhookSkippedResponse
    | WebhookErrorResponse;
