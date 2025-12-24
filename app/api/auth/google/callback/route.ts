import { prisma } from "@/lib/prisma";
import { exchangeCodeForTokens } from "@/lib/google/oauth";
import { sendWhatsAppReply } from "@/lib/whatsapp/message-handler";
import { NextRequest, NextResponse } from "next/server";
import { ulid } from "ulid";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // This is our AuthState ID (ULID)

    if (!code || !state) {
        return new NextResponse("Missing code or state parameters.", { status: 400 });
    }

    try {
        // 1. Verify AuthState still exists and isn't expired
        const authState = await prisma.authState.findUnique({
            where: { id: state },
        });

        if (!authState || new Date() > authState.expiresAt) {
            return new NextResponse("Invalid or expired authentication session.", { status: 400 });
        }

        // 2. Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // 3. Find or Create User by whatsappId
        let user = await prisma.user.findUnique({
            where: { whatsappId: authState.whatsappId },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: ulid(),
                    whatsappId: authState.whatsappId,
                },
            });
        }

        // 4. Create or Update OAuthAccount
        // Note: For simplicity, we'll use a single OAuthAccount per user for now
        const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

        await prisma.oAuthAccount.upsert({
            where: { id: user.id }, // Reusing user ID as OAuthAccount ID for 1-to-1 mapping
            update: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || undefined, // Sometimes Google doesn't return a new one if already granted
                expiresAt: expiresAt,
                scope: tokens.scope,
            },
            create: {
                id: user.id,
                userId: user.id,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token || "",
                expiresAt: expiresAt,
                scope: tokens.scope,
            },
        });

        // 5. Clean up AuthState
        await prisma.authState.delete({
            where: { id: state },
        });

        // 6. Notify user via WhatsApp
        await sendWhatsAppReply(
            authState.whatsappId,
            "✅ Success! Your Google account has been connected. You can now use Google Calendar features.",
            "default"
        );

        // 7. Redirect to a success page
        return new NextResponse(`
            <html>
                <body style="font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5;">
                    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center;">
                        <h1 style="color: #4CAF50;">Success!</h1>
                        <p>Your Google account has been connected to Fin.</p>
                        <p>You can close this window and go back to WhatsApp.</p>
                    </div>
                </body>
            </html>
        `, {
            headers: { "Content-Type": "text/html" }
        });

    } catch (error) {
        console.error("OAuth Callback Error:", error);
        return new NextResponse("Authentication failed. Please try again.", { status: 500 });
    }
}
