import { prisma } from '@/lib/prisma';
import { ulid } from 'ulid';

/**
 * Google OAuth 2.0 Utility functions
 */

export interface GoogleTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token?: string;
    scope: string;
    token_type: string;
    id_token?: string;
}

/**
 * Generate a Google OAuth 2.0 authorization URL
 * 
 * @param scopes - Array of scopes to request
 * @param state - Optional state parameter for security
 * @returns The authorization URL
 */
export function getGoogleAuthUrl(
    scopes: string[] = [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile'
    ],
    state?: string
): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
        throw new Error('Missing environment variables: GOOGLE_CLIENT_ID or GOOGLE_REDIRECT_URI');
    }

    const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scopes.join(' '),
        access_type: 'offline',
        prompt: 'consent',
    });

    if (state) {
        params.append('state', state);
    }

    return `${baseUrl}?${params.toString()}`;
}

/**
 * Exchange an authorization code for access and refresh tokens
 * 
 * @param code - The authorization code from the redirect
 * @returns Token response object
 */
export async function exchangeCodeForTokens(
    code: string
): Promise<GoogleTokenResponse> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Missing Google OAuth environment variables');
    }

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to exchange code for tokens: ${JSON.stringify(error)}`);
    }

    return response.json();
}

/**
 * Refresh an expired access token
 * 
 * @param refreshToken - The refresh token
 * @returns New token response (usually without a new refresh token)
 */
export async function refreshAccessToken(
    refreshToken: string
): Promise<Omit<GoogleTokenResponse, 'refresh_token'>> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing Google OAuth environment variables');
    }

    const url = 'https://oauth2.googleapis.com/token';
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to refresh access token: ${JSON.stringify(error)}`);
    }

    return response.json();
}

/**
 * Create a shortened deep link for Google Auth
 * 
 * @param whatsappId - The user's WhatsApp ID
 * @returns The shortened deep link URL
 */
export async function createAuthDeepLink(whatsappId: string): Promise<string> {
    const id = ulid();
    const longUrl = getGoogleAuthUrl(undefined, id);

    // Set expiry to 1 hour from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Clear existing state for this user to ensure only one active session
    await prisma.authState.deleteMany({
        where: { whatsappId }
    });

    await prisma.authState.create({
        data: {
            id,
            whatsappId,
            longUrl,
            expiresAt,
        }
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/g/${id}`;
}
