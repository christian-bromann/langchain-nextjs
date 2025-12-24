import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;

    const authState = await prisma.authState.findUnique({
        where: { id },
    });

    if (!authState) {
        return new NextResponse("Invalid or expired authentication link.", { status: 404 });
    }

    if (new Date() > authState.expiresAt) {
        // Optionally delete expired state
        await prisma.authState.delete({ where: { id } });
        return new NextResponse("Authentication link has expired.", { status: 410 });
    }

    // Redirect to the long Google OAuth URL
    return NextResponse.redirect(authState.longUrl);
}
