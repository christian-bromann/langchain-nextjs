/**
 * Google Calendar API Client
 * 
 * A comprehensive TypeScript client for the Google Calendar API v3.
 * Handles authentication, API requests, and provides type-safe methods
 * for all calendar operations.
 * 
 * @see https://developers.google.com/calendar/api/v3/reference
 */

import type {
    CalendarEvent,
    Calendar,
    CalendarListEntry,
    CalendarListResponse,
    EventsListResponse,
    EventsListParams,
    EventsInsertParams,
    EventsUpdateParams,
    EventsDeleteParams,
    QuickAddParams,
    FreeBusyRequest,
    FreeBusyResponse,
    AclRule,
    AclListResponse,
    Colors,
    Setting,
    SettingsListResponse,
    CalendarApiError,
} from './types';

export interface CalendarClientConfig {
    /**
     * OAuth 2.0 access token
     */
    accessToken: string;

    /**
     * Base URL for the Calendar API
     * @default 'https://www.googleapis.com/calendar/v3'
     */
    baseUrl?: string;

    /**
     * Custom fetch implementation (useful for testing or custom networking)
     */
    fetch?: typeof fetch;
}

export class CalendarApiClient {
    private accessToken: string;
    private baseUrl: string;
    private fetchFn: typeof fetch;

    constructor(config: CalendarClientConfig) {
        this.accessToken = config.accessToken;
        this.baseUrl = config.baseUrl || 'https://www.googleapis.com/calendar/v3';
        this.fetchFn = config.fetch || fetch;
    }

    /**
     * Update the access token (useful for token refresh)
     */
    setAccessToken(token: string): void {
        this.accessToken = token;
    }

    /**
     * Make an authenticated request to the Calendar API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await this.fetchFn(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error: CalendarApiError = await response.json();
            throw new Error(
                `Calendar API Error (${error.error.code}): ${error.error.message}`
            );
        }

        // Handle 204 No Content responses
        if (response.status === 204) {
            return {} as T;
        }

        return response.json();
    }

    /**
     * Build query string from parameters
     */
    private buildQueryString(params: Record<string, any>): string {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    value.forEach(v => searchParams.append(key, String(v)));
                } else {
                    searchParams.append(key, String(value));
                }
            }
        });

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : '';
    }

    // ============================================================================
    // Events API
    // ============================================================================

    /**
     * List events on a calendar
     * @see https://developers.google.com/calendar/api/v3/reference/events/list
     */
    async listEvents(params: EventsListParams): Promise<EventsListResponse> {
        const { calendarId, ...queryParams } = params;
        const query = this.buildQueryString(queryParams);
        return this.request<EventsListResponse>(
            `/calendars/${encodeURIComponent(calendarId)}/events${query}`
        );
    }

    /**
     * Get a specific event
     * @see https://developers.google.com/calendar/api/v3/reference/events/get
     */
    async getEvent(
        calendarId: string,
        eventId: string,
        params?: {
            alwaysIncludeEmail?: boolean;
            maxAttendees?: number;
            timeZone?: string;
        }
    ): Promise<CalendarEvent> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query}`
        );
    }

    /**
     * Create a new event
     * @see https://developers.google.com/calendar/api/v3/reference/events/insert
     */
    async createEvent(
        event: CalendarEvent,
        params: EventsInsertParams
    ): Promise<CalendarEvent> {
        const { calendarId, ...queryParams } = params;
        const query = this.buildQueryString(queryParams);
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events${query}`,
            {
                method: 'POST',
                body: JSON.stringify(event),
            }
        );
    }

    /**
     * Update an existing event
     * @see https://developers.google.com/calendar/api/v3/reference/events/update
     */
    async updateEvent(
        event: CalendarEvent,
        params: EventsUpdateParams
    ): Promise<CalendarEvent> {
        const { calendarId, eventId, ...queryParams } = params;
        const query = this.buildQueryString(queryParams);
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query}`,
            {
                method: 'PUT',
                body: JSON.stringify(event),
            }
        );
    }

    /**
     * Patch an existing event (partial update)
     * @see https://developers.google.com/calendar/api/v3/reference/events/patch
     */
    async patchEvent(
        eventId: string,
        calendarId: string,
        updates: Partial<CalendarEvent>,
        params?: {
            alwaysIncludeEmail?: boolean;
            conferenceDataVersion?: number;
            maxAttendees?: number;
            sendNotifications?: boolean;
            sendUpdates?: 'all' | 'externalOnly' | 'none';
            supportsAttachments?: boolean;
        }
    ): Promise<CalendarEvent> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query}`,
            {
                method: 'PATCH',
                body: JSON.stringify(updates),
            }
        );
    }

    /**
     * Delete an event
     * @see https://developers.google.com/calendar/api/v3/reference/events/delete
     */
    async deleteEvent(params: EventsDeleteParams): Promise<void> {
        const { calendarId, eventId, ...queryParams } = params;
        const query = this.buildQueryString(queryParams);
        await this.request<void>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}${query}`,
            {
                method: 'DELETE',
            }
        );
    }

    /**
     * Quick add an event using natural language
     * @see https://developers.google.com/calendar/api/v3/reference/events/quickAdd
     */
    async quickAddEvent(params: QuickAddParams): Promise<CalendarEvent> {
        const { calendarId, ...queryParams } = params;
        const query = this.buildQueryString(queryParams);
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/quickAdd${query}`,
            {
                method: 'POST',
            }
        );
    }

    /**
     * Import an event
     * @see https://developers.google.com/calendar/api/v3/reference/events/import
     */
    async importEvent(
        calendarId: string,
        event: CalendarEvent,
        params?: {
            conferenceDataVersion?: number;
            supportsAttachments?: boolean;
        }
    ): Promise<CalendarEvent> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/import${query}`,
            {
                method: 'POST',
                body: JSON.stringify(event),
            }
        );
    }

    /**
     * Move an event to another calendar
     * @see https://developers.google.com/calendar/api/v3/reference/events/move
     */
    async moveEvent(
        calendarId: string,
        eventId: string,
        destination: string,
        params?: {
            sendNotifications?: boolean;
            sendUpdates?: 'all' | 'externalOnly' | 'none';
        }
    ): Promise<CalendarEvent> {
        const query = this.buildQueryString({ destination, ...params });
        return this.request<CalendarEvent>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}/move${query}`,
            {
                method: 'POST',
            }
        );
    }

    /**
     * Get instances of a recurring event
     * @see https://developers.google.com/calendar/api/v3/reference/events/instances
     */
    async getEventInstances(
        calendarId: string,
        eventId: string,
        params?: {
            alwaysIncludeEmail?: boolean;
            maxAttendees?: number;
            maxResults?: number;
            originalStart?: string;
            pageToken?: string;
            showDeleted?: boolean;
            timeMin?: string;
            timeMax?: string;
            timeZone?: string;
        }
    ): Promise<EventsListResponse> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<EventsListResponse>(
            `/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}/instances${query}`
        );
    }

    // ============================================================================
    // Calendars API
    // ============================================================================

    /**
     * Get calendar metadata
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/get
     */
    async getCalendar(calendarId: string): Promise<Calendar> {
        return this.request<Calendar>(
            `/calendars/${encodeURIComponent(calendarId)}`
        );
    }

    /**
     * Create a new calendar
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/insert
     */
    async createCalendar(calendar: Calendar): Promise<Calendar> {
        return this.request<Calendar>('/calendars', {
            method: 'POST',
            body: JSON.stringify(calendar),
        });
    }

    /**
     * Update calendar metadata
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/update
     */
    async updateCalendar(
        calendarId: string,
        calendar: Calendar
    ): Promise<Calendar> {
        return this.request<Calendar>(
            `/calendars/${encodeURIComponent(calendarId)}`,
            {
                method: 'PUT',
                body: JSON.stringify(calendar),
            }
        );
    }

    /**
     * Patch calendar metadata (partial update)
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/patch
     */
    async patchCalendar(
        calendarId: string,
        updates: Partial<Calendar>
    ): Promise<Calendar> {
        return this.request<Calendar>(
            `/calendars/${encodeURIComponent(calendarId)}`,
            {
                method: 'PATCH',
                body: JSON.stringify(updates),
            }
        );
    }

    /**
     * Delete a calendar
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/delete
     */
    async deleteCalendar(calendarId: string): Promise<void> {
        await this.request<void>(
            `/calendars/${encodeURIComponent(calendarId)}`,
            {
                method: 'DELETE',
            }
        );
    }

    /**
     * Clear all events from a calendar
     * @see https://developers.google.com/calendar/api/v3/reference/calendars/clear
     */
    async clearCalendar(calendarId: string): Promise<void> {
        await this.request<void>(
            `/calendars/${encodeURIComponent(calendarId)}/clear`,
            {
                method: 'POST',
            }
        );
    }

    // ============================================================================
    // Calendar List API
    // ============================================================================

    /**
     * List all calendars in the user's calendar list
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/list
     */
    async listCalendars(params?: {
        maxResults?: number;
        minAccessRole?: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
        pageToken?: string;
        showDeleted?: boolean;
        showHidden?: boolean;
        syncToken?: string;
    }): Promise<CalendarListResponse> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<CalendarListResponse>(`/users/me/calendarList${query}`);
    }

    /**
     * Get a calendar from the user's calendar list
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/get
     */
    async getCalendarListEntry(calendarId: string): Promise<CalendarListEntry> {
        return this.request<CalendarListEntry>(
            `/users/me/calendarList/${encodeURIComponent(calendarId)}`
        );
    }

    /**
     * Add a calendar to the user's calendar list
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/insert
     */
    async addToCalendarList(
        entry: CalendarListEntry
    ): Promise<CalendarListEntry> {
        return this.request<CalendarListEntry>('/users/me/calendarList', {
            method: 'POST',
            body: JSON.stringify(entry),
        });
    }

    /**
     * Update a calendar list entry
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/update
     */
    async updateCalendarListEntry(
        calendarId: string,
        entry: CalendarListEntry
    ): Promise<CalendarListEntry> {
        return this.request<CalendarListEntry>(
            `/users/me/calendarList/${encodeURIComponent(calendarId)}`,
            {
                method: 'PUT',
                body: JSON.stringify(entry),
            }
        );
    }

    /**
     * Patch a calendar list entry (partial update)
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/patch
     */
    async patchCalendarListEntry(
        calendarId: string,
        updates: Partial<CalendarListEntry>
    ): Promise<CalendarListEntry> {
        return this.request<CalendarListEntry>(
            `/users/me/calendarList/${encodeURIComponent(calendarId)}`,
            {
                method: 'PATCH',
                body: JSON.stringify(updates),
            }
        );
    }

    /**
     * Remove a calendar from the user's calendar list
     * @see https://developers.google.com/calendar/api/v3/reference/calendarList/delete
     */
    async removeFromCalendarList(calendarId: string): Promise<void> {
        await this.request<void>(
            `/users/me/calendarList/${encodeURIComponent(calendarId)}`,
            {
                method: 'DELETE',
            }
        );
    }

    // ============================================================================
    // ACL API
    // ============================================================================

    /**
     * List ACL rules for a calendar
     * @see https://developers.google.com/calendar/api/v3/reference/acl/list
     */
    async listAclRules(
        calendarId: string,
        params?: {
            maxResults?: number;
            pageToken?: string;
            showDeleted?: boolean;
            syncToken?: string;
        }
    ): Promise<AclListResponse> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<AclListResponse>(
            `/calendars/${encodeURIComponent(calendarId)}/acl${query}`
        );
    }

    /**
     * Get an ACL rule
     * @see https://developers.google.com/calendar/api/v3/reference/acl/get
     */
    async getAclRule(calendarId: string, ruleId: string): Promise<AclRule> {
        return this.request<AclRule>(
            `/calendars/${encodeURIComponent(calendarId)}/acl/${encodeURIComponent(ruleId)}`
        );
    }

    /**
     * Create an ACL rule
     * @see https://developers.google.com/calendar/api/v3/reference/acl/insert
     */
    async createAclRule(
        calendarId: string,
        rule: AclRule,
        params?: {
            sendNotifications?: boolean;
        }
    ): Promise<AclRule> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<AclRule>(
            `/calendars/${encodeURIComponent(calendarId)}/acl${query}`,
            {
                method: 'POST',
                body: JSON.stringify(rule),
            }
        );
    }

    /**
     * Update an ACL rule
     * @see https://developers.google.com/calendar/api/v3/reference/acl/update
     */
    async updateAclRule(
        calendarId: string,
        ruleId: string,
        rule: AclRule,
        params?: {
            sendNotifications?: boolean;
        }
    ): Promise<AclRule> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<AclRule>(
            `/calendars/${encodeURIComponent(calendarId)}/acl/${encodeURIComponent(ruleId)}${query}`,
            {
                method: 'PUT',
                body: JSON.stringify(rule),
            }
        );
    }

    /**
     * Patch an ACL rule (partial update)
     * @see https://developers.google.com/calendar/api/v3/reference/acl/patch
     */
    async patchAclRule(
        calendarId: string,
        ruleId: string,
        updates: Partial<AclRule>,
        params?: {
            sendNotifications?: boolean;
        }
    ): Promise<AclRule> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<AclRule>(
            `/calendars/${encodeURIComponent(calendarId)}/acl/${encodeURIComponent(ruleId)}${query}`,
            {
                method: 'PATCH',
                body: JSON.stringify(updates),
            }
        );
    }

    /**
     * Delete an ACL rule
     * @see https://developers.google.com/calendar/api/v3/reference/acl/delete
     */
    async deleteAclRule(calendarId: string, ruleId: string): Promise<void> {
        await this.request<void>(
            `/calendars/${encodeURIComponent(calendarId)}/acl/${encodeURIComponent(ruleId)}`,
            {
                method: 'DELETE',
            }
        );
    }

    // ============================================================================
    // FreeBusy API
    // ============================================================================

    /**
     * Query free/busy information for calendars
     * @see https://developers.google.com/calendar/api/v3/reference/freebusy/query
     */
    async queryFreeBusy(request: FreeBusyRequest): Promise<FreeBusyResponse> {
        return this.request<FreeBusyResponse>('/freeBusy', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }

    // ============================================================================
    // Colors API
    // ============================================================================

    /**
     * Get available colors for calendars and events
     * @see https://developers.google.com/calendar/api/v3/reference/colors/get
     */
    async getColors(): Promise<Colors> {
        return this.request<Colors>('/colors');
    }

    // ============================================================================
    // Settings API
    // ============================================================================

    /**
     * List user settings
     * @see https://developers.google.com/calendar/api/v3/reference/settings/list
     */
    async listSettings(params?: {
        maxResults?: number;
        pageToken?: string;
        syncToken?: string;
    }): Promise<SettingsListResponse> {
        const query = params ? this.buildQueryString(params) : '';
        return this.request<SettingsListResponse>(`/users/me/settings${query}`);
    }

    /**
     * Get a specific setting
     * @see https://developers.google.com/calendar/api/v3/reference/settings/get
     */
    async getSetting(settingId: string): Promise<Setting> {
        return this.request<Setting>(
            `/users/me/settings/${encodeURIComponent(settingId)}`
        );
    }
}
