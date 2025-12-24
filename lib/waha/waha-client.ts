import { WahaClient } from './waha';

let wahaClientInstance: WahaClient | null = null;

/**
 * Get the singleton instance of WahaClient
 * This ensures we only create one client instance across the application
 */
export function getWahaClient(): WahaClient {
    if (!wahaClientInstance) {
        const baseUrl = process.env.NEXT_PUBLIC_WAHA_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_WAHA_API_KEY;

        if (!baseUrl || !apiKey) {
            throw new Error(
                'WAHA configuration missing: NEXT_PUBLIC_WAHA_API_URL and NEXT_PUBLIC_WAHA_API_KEY must be set'
            );
        }

        wahaClientInstance = new WahaClient({
            baseUrl,
            apiKey,
        });
    }

    return wahaClientInstance;
}

/**
 * Reset the client instance (useful for testing or config changes)
 */
export function resetWahaClient(): void {
    wahaClientInstance = null;
}
