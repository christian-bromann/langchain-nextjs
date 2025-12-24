/**
 * Google Calendar API Library
 * 
 * A comprehensive TypeScript library for interacting with the Google Calendar API v3.
 * 
 * @example
 * ```typescript
 * import { CalendarService } from './lib/google/calendar';
 * 
 * const calendar = new CalendarService({
 *   accessToken: 'your-oauth-token',
 *   defaultCalendarId: 'primary'
 * });
 * 
 * // Create an event
 * const event = await calendar.createEvent({
 *   summary: 'Team Meeting',
 *   startTime: new Date('2024-01-15T10:00:00'),
 *   endTime: new Date('2024-01-15T11:00:00'),
 *   attendees: ['john@example.com', 'jane@example.com']
 * });
 * 
 * // Get upcoming events
 * const upcoming = await calendar.getUpcomingEvents(10);
 * 
 * // Find available time slots
 * const slots = await calendar.findAvailableSlots(
 *   new Date(),
 *   new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
 *   60 // 60 minutes
 * );
 * ```
 * 
 * @see https://developers.google.com/calendar/api/v3/reference
 */

export { CalendarApiClient } from './client';
export { CalendarService } from './service';
export * from './types';
export * from './calendar-utils';
