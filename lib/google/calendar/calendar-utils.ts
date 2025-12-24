/**
 * Utility functions for Google Calendar operations
 */

import type { CalendarEvent, EventDateTime } from './types';

/**
 * Parse an EventDateTime to a JavaScript Date
 */
export function parseEventDateTime(eventDateTime: EventDateTime): Date {
    if (eventDateTime.dateTime) {
        return new Date(eventDateTime.dateTime);
    } else if (eventDateTime.date) {
        return new Date(eventDateTime.date);
    }
    throw new Error('Invalid EventDateTime: missing both date and dateTime');
}

/**
 * Get the start time of an event as a Date
 */
export function getEventStartTime(event: CalendarEvent): Date | null {
    if (!event.start) return null;
    return parseEventDateTime(event.start);
}

/**
 * Get the end time of an event as a Date
 */
export function getEventEndTime(event: CalendarEvent): Date | null {
    if (!event.end) return null;
    return parseEventDateTime(event.end);
}

/**
 * Check if an event is all-day
 */
export function isAllDayEvent(event: CalendarEvent): boolean {
    return !!(event.start?.date && !event.start?.dateTime);
}

/**
 * Check if an event is recurring
 */
export function isRecurringEvent(event: CalendarEvent): boolean {
    return !!(event.recurrence && event.recurrence.length > 0);
}

/**
 * Get event duration in minutes
 */
export function getEventDuration(event: CalendarEvent): number | null {
    const start = getEventStartTime(event);
    const end = getEventEndTime(event);

    if (!start || !end) return null;

    return Math.round((end.getTime() - start.getTime()) / 60000);
}

/**
 * Check if an event is happening now
 */
export function isEventHappeningNow(event: CalendarEvent): boolean {
    const now = new Date();
    const start = getEventStartTime(event);
    const end = getEventEndTime(event);

    if (!start || !end) return false;

    return now >= start && now <= end;
}

/**
 * Check if an event is in the future
 */
export function isEventInFuture(event: CalendarEvent): boolean {
    const now = new Date();
    const start = getEventStartTime(event);

    if (!start) return false;

    return start > now;
}

/**
 * Check if an event is in the past
 */
export function isEventInPast(event: CalendarEvent): boolean {
    const now = new Date();
    const end = getEventEndTime(event);

    if (!end) return false;

    return end < now;
}

/**
 * Format event time for display
 */
export function formatEventTime(event: CalendarEvent, locale: string = 'en-US'): string {
    if (isAllDayEvent(event)) {
        const start = getEventStartTime(event);
        if (!start) return 'Unknown date';
        return start.toLocaleDateString(locale, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    const start = getEventStartTime(event);
    const end = getEventEndTime(event);

    if (!start || !end) return 'Unknown time';

    const dateStr = start.toLocaleDateString(locale, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    const startTime = start.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
    });

    const endTime = end.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: '2-digit',
    });

    return `${dateStr}, ${startTime} - ${endTime}`;
}

/**
 * Create an iCalendar RRULE string for daily recurrence
 */
export function createDailyRecurrence(
    interval: number = 1,
    count?: number,
    until?: Date
): string {
    let rule = `RRULE:FREQ=DAILY;INTERVAL=${interval}`;

    if (count) {
        rule += `;COUNT=${count}`;
    } else if (until) {
        const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        rule += `;UNTIL=${untilStr}`;
    }

    return rule;
}

/**
 * Create an iCalendar RRULE string for weekly recurrence
 */
export function createWeeklyRecurrence(
    interval: number = 1,
    daysOfWeek?: ('MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU')[],
    count?: number,
    until?: Date
): string {
    let rule = `RRULE:FREQ=WEEKLY;INTERVAL=${interval}`;

    if (daysOfWeek && daysOfWeek.length > 0) {
        rule += `;BYDAY=${daysOfWeek.join(',')}`;
    }

    if (count) {
        rule += `;COUNT=${count}`;
    } else if (until) {
        const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        rule += `;UNTIL=${untilStr}`;
    }

    return rule;
}

/**
 * Create an iCalendar RRULE string for monthly recurrence
 */
export function createMonthlyRecurrence(
    interval: number = 1,
    dayOfMonth?: number,
    count?: number,
    until?: Date
): string {
    let rule = `RRULE:FREQ=MONTHLY;INTERVAL=${interval}`;

    if (dayOfMonth) {
        rule += `;BYMONTHDAY=${dayOfMonth}`;
    }

    if (count) {
        rule += `;COUNT=${count}`;
    } else if (until) {
        const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        rule += `;UNTIL=${untilStr}`;
    }

    return rule;
}

/**
 * Create an iCalendar RRULE string for yearly recurrence
 */
export function createYearlyRecurrence(
    interval: number = 1,
    count?: number,
    until?: Date
): string {
    let rule = `RRULE:FREQ=YEARLY;INTERVAL=${interval}`;

    if (count) {
        rule += `;COUNT=${count}`;
    } else if (until) {
        const untilStr = until.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        rule += `;UNTIL=${untilStr}`;
    }

    return rule;
}

/**
 * Sort events by start time
 */
export function sortEventsByStartTime(
    events: CalendarEvent[],
    ascending: boolean = true
): CalendarEvent[] {
    return [...events].sort((a, b) => {
        const aStart = getEventStartTime(a);
        const bStart = getEventStartTime(b);

        if (!aStart || !bStart) return 0;

        const diff = aStart.getTime() - bStart.getTime();
        return ascending ? diff : -diff;
    });
}

/**
 * Filter events by date range
 */
export function filterEventsByDateRange(
    events: CalendarEvent[],
    startDate: Date,
    endDate: Date
): CalendarEvent[] {
    return events.filter(event => {
        const eventStart = getEventStartTime(event);
        const eventEnd = getEventEndTime(event);

        if (!eventStart || !eventEnd) return false;

        // Event overlaps with the range if:
        // - Event starts before range ends AND
        // - Event ends after range starts
        return eventStart < endDate && eventEnd > startDate;
    });
}

/**
 * Group events by date
 */
export function groupEventsByDate(
    events: CalendarEvent[],
    locale: string = 'en-US'
): Map<string, CalendarEvent[]> {
    const grouped = new Map<string, CalendarEvent[]>();

    for (const event of events) {
        const start = getEventStartTime(event);
        if (!start) continue;

        const dateKey = start.toLocaleDateString(locale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });

        if (!grouped.has(dateKey)) {
            grouped.set(dateKey, []);
        }

        grouped.get(dateKey)!.push(event);
    }

    return grouped;
}

/**
 * Check if two events overlap
 */
export function doEventsOverlap(event1: CalendarEvent, event2: CalendarEvent): boolean {
    const start1 = getEventStartTime(event1);
    const end1 = getEventEndTime(event1);
    const start2 = getEventStartTime(event2);
    const end2 = getEventEndTime(event2);

    if (!start1 || !end1 || !start2 || !end2) return false;

    return start1 < end2 && end1 > start2;
}

/**
 * Get attendee response summary
 */
export function getAttendeeResponseSummary(event: CalendarEvent): {
    accepted: number;
    declined: number;
    tentative: number;
    needsAction: number;
    total: number;
} {
    const summary = {
        accepted: 0,
        declined: 0,
        tentative: 0,
        needsAction: 0,
        total: 0,
    };

    if (!event.attendees) return summary;

    for (const attendee of event.attendees) {
        summary.total++;

        switch (attendee.responseStatus) {
            case 'accepted':
                summary.accepted++;
                break;
            case 'declined':
                summary.declined++;
                break;
            case 'tentative':
                summary.tentative++;
                break;
            case 'needsAction':
            default:
                summary.needsAction++;
                break;
        }
    }

    return summary;
}

/**
 * Create a Google Meet conference data object
 */
export function createGoogleMeetConference(requestId?: string) {
    return {
        createRequest: {
            requestId: requestId || `meet-${Date.now()}`,
            conferenceSolutionKey: {
                type: 'hangoutsMeet',
            },
        },
    };
}

/**
 * Extract Google Meet link from event
 */
export function getGoogleMeetLink(event: CalendarEvent): string | null {
    // Check hangoutLink first (legacy)
    if (event.hangoutLink) {
        return event.hangoutLink;
    }

    // Check conferenceData
    if (event.conferenceData?.entryPoints) {
        const videoEntry = event.conferenceData.entryPoints.find(
            entry => entry.entryPointType === 'video'
        );
        if (videoEntry?.uri) {
            return videoEntry.uri;
        }
    }

    return null;
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Get time until event starts
 */
export function getTimeUntilEvent(event: CalendarEvent): number | null {
    const start = getEventStartTime(event);
    if (!start) return null;

    const now = new Date();
    return start.getTime() - now.getTime();
}

/**
 * Format time until event in human-readable format
 */
export function formatTimeUntilEvent(event: CalendarEvent): string | null {
    const ms = getTimeUntilEvent(event);
    if (ms === null) return null;

    if (ms < 0) return 'Started';

    const minutes = Math.floor(ms / 60000);

    if (minutes < 60) {
        return `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `in ${hours} hour${hours !== 1 ? 's' : ''}`;
    }

    const days = Math.floor(hours / 24);
    return `in ${days} day${days !== 1 ? 's' : ''}`;
}
