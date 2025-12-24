/**
 * Google Calendar Service
 * 
 * High-level service layer for Google Calendar operations.
 * Provides convenient helper methods and utilities for common calendar tasks.
 */

import { CalendarApiClient } from './client';
import type {
    CalendarEvent,
    EventDateTime,
    CalendarListEntry,
    FreeBusyRequest,
    FreeBusyResponse,
} from './types';

export interface CalendarServiceConfig {
    accessToken: string;
    defaultCalendarId?: string;
}

export interface CreateEventOptions {
    summary: string;
    description?: string;
    location?: string;
    startTime: Date | string;
    endTime: Date | string;
    timeZone?: string;
    attendees?: string[];
    reminders?: {
        useDefault?: boolean;
        overrides?: Array<{
            method: 'email' | 'popup';
            minutes: number;
        }>;
    };
    conferenceData?: {
        createRequest?: {
            requestId: string;
            conferenceSolutionKey: {
                type: string;
            };
        };
    };
    recurrence?: string[];
    visibility?: 'default' | 'public' | 'private' | 'confidential';
    sendNotifications?: boolean;
}

export interface UpdateEventOptions extends Partial<CreateEventOptions> {
    eventId: string;
    sendNotifications?: boolean;
    sendUpdates?: 'all' | 'externalOnly' | 'none';
}

export interface ListEventsOptions {
    timeMin?: Date | string;
    timeMax?: Date | string;
    maxResults?: number;
    orderBy?: 'startTime' | 'updated';
    singleEvents?: boolean;
    q?: string;
    showDeleted?: boolean;
}

export class CalendarService {
    private client: CalendarApiClient;
    private defaultCalendarId: string;

    constructor(config: CalendarServiceConfig) {
        this.client = new CalendarApiClient({
            accessToken: config.accessToken,
        });
        this.defaultCalendarId = config.defaultCalendarId || 'primary';
    }

    /**
     * Update the access token (useful for token refresh)
     */
    setAccessToken(token: string): void {
        this.client.setAccessToken(token);
    }

    /**
     * Set the default calendar ID
     */
    setDefaultCalendar(calendarId: string): void {
        this.defaultCalendarId = calendarId;
    }

    // ============================================================================
    // Helper Methods for Events
    // ============================================================================

    /**
     * Create a new event with simplified options
     */
    async createEvent(
        options: CreateEventOptions,
        calendarId?: string
    ): Promise<CalendarEvent> {
        const targetCalendar = calendarId || this.defaultCalendarId;

        const event: CalendarEvent = {
            summary: options.summary,
            description: options.description,
            location: options.location,
            start: this.toEventDateTime(options.startTime, options.timeZone),
            end: this.toEventDateTime(options.endTime, options.timeZone),
            attendees: options.attendees?.map(email => ({ email })),
            reminders: options.reminders,
            conferenceData: options.conferenceData,
            recurrence: options.recurrence,
            visibility: options.visibility,
        };

        return this.client.createEvent(event, {
            calendarId: targetCalendar,
            sendNotifications: options.sendNotifications,
            conferenceDataVersion: options.conferenceData ? 1 : undefined,
        });
    }

    /**
     * Update an existing event
     */
    async updateEvent(
        options: UpdateEventOptions,
        calendarId?: string
    ): Promise<CalendarEvent> {
        const targetCalendar = calendarId || this.defaultCalendarId;

        const updates: Partial<CalendarEvent> = {};

        if (options.summary !== undefined) updates.summary = options.summary;
        if (options.description !== undefined) updates.description = options.description;
        if (options.location !== undefined) updates.location = options.location;
        if (options.startTime !== undefined) {
            updates.start = this.toEventDateTime(options.startTime, options.timeZone);
        }
        if (options.endTime !== undefined) {
            updates.end = this.toEventDateTime(options.endTime, options.timeZone);
        }
        if (options.attendees !== undefined) {
            updates.attendees = options.attendees.map(email => ({ email }));
        }
        if (options.reminders !== undefined) updates.reminders = options.reminders;
        if (options.recurrence !== undefined) updates.recurrence = options.recurrence;
        if (options.visibility !== undefined) updates.visibility = options.visibility;

        return this.client.patchEvent(
            options.eventId,
            targetCalendar,
            updates,
            {
                sendNotifications: options.sendNotifications,
                sendUpdates: options.sendUpdates,
            }
        );
    }

    /**
     * Delete an event
     */
    async deleteEvent(
        eventId: string,
        calendarId?: string,
        sendNotifications?: boolean
    ): Promise<void> {
        const targetCalendar = calendarId || this.defaultCalendarId;

        return this.client.deleteEvent({
            calendarId: targetCalendar,
            eventId,
            sendNotifications,
        });
    }

    /**
     * Get a specific event
     */
    async getEvent(
        eventId: string,
        calendarId?: string
    ): Promise<CalendarEvent> {
        const targetCalendar = calendarId || this.defaultCalendarId;
        return this.client.getEvent(targetCalendar, eventId);
    }

    /**
     * List events with simplified options
     */
    async listEvents(
        options?: ListEventsOptions,
        calendarId?: string
    ): Promise<CalendarEvent[]> {
        const targetCalendar = calendarId || this.defaultCalendarId;

        const response = await this.client.listEvents({
            calendarId: targetCalendar,
            timeMin: options?.timeMin ? this.toISOString(options.timeMin) : undefined,
            timeMax: options?.timeMax ? this.toISOString(options.timeMax) : undefined,
            maxResults: options?.maxResults,
            orderBy: options?.orderBy,
            singleEvents: options?.singleEvents ?? true,
            q: options?.q,
            showDeleted: options?.showDeleted,
        });

        return response.items || [];
    }

    /**
     * Get upcoming events (next N events starting from now)
     */
    async getUpcomingEvents(
        count: number = 10,
        calendarId?: string
    ): Promise<CalendarEvent[]> {
        return this.listEvents(
            {
                timeMin: new Date(),
                maxResults: count,
                orderBy: 'startTime',
                singleEvents: true,
            },
            calendarId
        );
    }

    /**
     * Get events for today
     */
    async getTodayEvents(calendarId?: string): Promise<CalendarEvent[]> {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        return this.listEvents(
            {
                timeMin: startOfDay,
                timeMax: endOfDay,
                orderBy: 'startTime',
                singleEvents: true,
            },
            calendarId
        );
    }

    /**
     * Get events for a specific date range
     */
    async getEventsInRange(
        startDate: Date | string,
        endDate: Date | string,
        calendarId?: string
    ): Promise<CalendarEvent[]> {
        return this.listEvents(
            {
                timeMin: startDate,
                timeMax: endDate,
                orderBy: 'startTime',
                singleEvents: true,
            },
            calendarId
        );
    }

    /**
     * Quick add an event using natural language
     * Example: "Meeting with John tomorrow at 3pm"
     */
    async quickAdd(
        text: string,
        calendarId?: string,
        sendNotifications?: boolean
    ): Promise<CalendarEvent> {
        const targetCalendar = calendarId || this.defaultCalendarId;

        return this.client.quickAddEvent({
            calendarId: targetCalendar,
            text,
            sendNotifications,
        });
    }

    // ============================================================================
    // Calendar Management
    // ============================================================================

    /**
     * List all calendars
     */
    async listCalendars(options?: {
        showHidden?: boolean;
        showDeleted?: boolean;
    }): Promise<CalendarListEntry[]> {
        const response = await this.client.listCalendars({
            showHidden: options?.showHidden,
            showDeleted: options?.showDeleted,
        });

        return response.items || [];
    }

    /**
     * Get primary calendar
     */
    async getPrimaryCalendar(): Promise<CalendarListEntry> {
        return this.client.getCalendarListEntry('primary');
    }

    /**
     * Create a new calendar
     */
    async createCalendar(
        summary: string,
        options?: {
            description?: string;
            location?: string;
            timeZone?: string;
        }
    ): Promise<CalendarListEntry> {
        const calendar = await this.client.createCalendar({
            summary,
            description: options?.description,
            location: options?.location,
            timeZone: options?.timeZone,
        });

        // Return the calendar list entry
        return this.client.getCalendarListEntry(calendar.id!);
    }

    // ============================================================================
    // Free/Busy Queries
    // ============================================================================

    /**
     * Check if a time slot is free
     */
    async isTimeFree(
        startTime: Date | string,
        endTime: Date | string,
        calendarIds?: string[]
    ): Promise<boolean> {
        const calendars = calendarIds || [this.defaultCalendarId];

        const request: FreeBusyRequest = {
            timeMin: this.toISOString(startTime),
            timeMax: this.toISOString(endTime),
            items: calendars.map(id => ({ id })),
        };

        const response = await this.client.queryFreeBusy(request);

        // Check if any calendar has busy periods
        for (const calendarId of calendars) {
            const calendarData = response.calendars?.[calendarId];
            if (calendarData?.busy && calendarData.busy.length > 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get busy periods for calendars
     */
    async getBusyPeriods(
        startTime: Date | string,
        endTime: Date | string,
        calendarIds?: string[]
    ): Promise<FreeBusyResponse> {
        const calendars = calendarIds || [this.defaultCalendarId];

        const request: FreeBusyRequest = {
            timeMin: this.toISOString(startTime),
            timeMax: this.toISOString(endTime),
            items: calendars.map(id => ({ id })),
        };

        return this.client.queryFreeBusy(request);
    }

    /**
     * Find available time slots
     */
    async findAvailableSlots(
        startDate: Date | string,
        endDate: Date | string,
        durationMinutes: number,
        options?: {
            calendarIds?: string[];
            workingHoursStart?: number; // 0-23
            workingHoursEnd?: number; // 0-23
            minSlots?: number;
        }
    ): Promise<Array<{ start: Date; end: Date }>> {
        const calendars = options?.calendarIds || [this.defaultCalendarId];
        const workStart = options?.workingHoursStart ?? 9;
        const workEnd = options?.workingHoursEnd ?? 17;

        const busyResponse = await this.getBusyPeriods(startDate, endDate, calendars);

        // Collect all busy periods
        const busyPeriods: Array<{ start: Date; end: Date }> = [];
        for (const calendarId of calendars) {
            const calendarData = busyResponse.calendars?.[calendarId];
            if (calendarData?.busy) {
                for (const period of calendarData.busy) {
                    busyPeriods.push({
                        start: new Date(period.start!),
                        end: new Date(period.end!),
                    });
                }
            }
        }

        // Sort busy periods by start time
        busyPeriods.sort((a, b) => a.start.getTime() - b.start.getTime());

        // Find available slots
        const availableSlots: Array<{ start: Date; end: Date }> = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        let currentTime = new Date(start);

        while (currentTime < end) {
            // Skip to next working day if needed
            const dayOfWeek = currentTime.getDay();
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                currentTime.setDate(currentTime.getDate() + 1);
                currentTime.setHours(workStart, 0, 0, 0);
                continue;
            }

            // Set to working hours
            if (currentTime.getHours() < workStart) {
                currentTime.setHours(workStart, 0, 0, 0);
            } else if (currentTime.getHours() >= workEnd) {
                currentTime.setDate(currentTime.getDate() + 1);
                currentTime.setHours(workStart, 0, 0, 0);
                continue;
            }

            const slotEnd = new Date(currentTime.getTime() + durationMinutes * 60000);

            // Check if slot is within working hours
            if (slotEnd.getHours() > workEnd) {
                currentTime.setDate(currentTime.getDate() + 1);
                currentTime.setHours(workStart, 0, 0, 0);
                continue;
            }

            // Check if slot conflicts with any busy period
            const hasConflict = busyPeriods.some(busy => {
                return (
                    (currentTime >= busy.start && currentTime < busy.end) ||
                    (slotEnd > busy.start && slotEnd <= busy.end) ||
                    (currentTime <= busy.start && slotEnd >= busy.end)
                );
            });

            if (!hasConflict) {
                availableSlots.push({
                    start: new Date(currentTime),
                    end: new Date(slotEnd),
                });

                if (options?.minSlots && availableSlots.length >= options.minSlots) {
                    break;
                }
            }

            // Move to next potential slot (15-minute increments)
            currentTime = new Date(currentTime.getTime() + 15 * 60000);
        }

        return availableSlots;
    }

    // ============================================================================
    // Utility Methods
    // ============================================================================

    /**
     * Convert Date or string to EventDateTime
     */
    private toEventDateTime(
        dateTime: Date | string,
        timeZone?: string
    ): EventDateTime {
        if (typeof dateTime === 'string') {
            // Check if it's a date-only string (YYYY-MM-DD)
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) {
                return { date: dateTime };
            }
            return { dateTime, timeZone };
        }

        return {
            dateTime: dateTime.toISOString(),
            timeZone,
        };
    }

    /**
     * Convert Date or string to ISO string
     */
    private toISOString(dateTime: Date | string): string {
        if (typeof dateTime === 'string') {
            return dateTime;
        }
        return dateTime.toISOString();
    }

    /**
     * Get the underlying API client for advanced usage
     */
    getClient(): CalendarApiClient {
        return this.client;
    }
}
