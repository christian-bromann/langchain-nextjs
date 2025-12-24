# Google Calendar API Library

A comprehensive TypeScript library for interacting with the Google Calendar API v3. This library provides type-safe methods for all calendar operations with a clean, intuitive interface.

## Features

- ✅ **Full TypeScript support** with comprehensive type definitions
- ✅ **Complete API coverage** for Events, Calendars, ACL, FreeBusy, Settings, and Colors
- ✅ **High-level service layer** with convenient helper methods
- ✅ **Utility functions** for common calendar operations
- ✅ **OAuth 2.0 authentication** support
- ✅ **Zero dependencies** (except for standard fetch API)

## Installation

This library is part of the `fin` project. No additional installation required.

## Quick Start

### Basic Usage

```typescript
import { CalendarService } from '@/lib/google/calendar';

// Initialize the service with your OAuth token
const calendar = new CalendarService({
  accessToken: 'your-oauth-2.0-access-token',
  defaultCalendarId: 'primary' // optional, defaults to 'primary'
});

// Create an event
const event = await calendar.createEvent({
  summary: 'Team Meeting',
  description: 'Quarterly planning session',
  location: 'Conference Room A',
  startTime: new Date('2024-01-15T10:00:00'),
  endTime: new Date('2024-01-15T11:00:00'),
  attendees: ['john@example.com', 'jane@example.com'],
  sendNotifications: true
});

console.log('Event created:', event.htmlLink);
```

### Get Upcoming Events

```typescript
// Get next 10 upcoming events
const upcoming = await calendar.getUpcomingEvents(10);

for (const event of upcoming) {
  console.log(`${event.summary} - ${event.start?.dateTime}`);
}
```

### Get Today's Events

```typescript
const todayEvents = await calendar.getTodayEvents();
console.log(`You have ${todayEvents.length} events today`);
```

### Quick Add (Natural Language)

```typescript
// Create events using natural language
const event = await calendar.quickAdd(
  'Meeting with John tomorrow at 3pm'
);
```

### Find Available Time Slots

```typescript
const now = new Date();
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

const availableSlots = await calendar.findAvailableSlots(
  now,
  nextWeek,
  60, // 60-minute duration
  {
    workingHoursStart: 9,
    workingHoursEnd: 17,
    minSlots: 5
  }
);

console.log('Available time slots:');
for (const slot of availableSlots) {
  console.log(`${slot.start} - ${slot.end}`);
}
```

### Update an Event

```typescript
await calendar.updateEvent({
  eventId: 'event-id-here',
  summary: 'Updated Meeting Title',
  startTime: new Date('2024-01-15T14:00:00'),
  endTime: new Date('2024-01-15T15:00:00'),
  sendNotifications: true
});
```

### Delete an Event

```typescript
await calendar.deleteEvent('event-id-here', 'primary', true);
```

## Advanced Usage

### Using the Low-Level API Client

For more control, you can use the `CalendarApiClient` directly:

```typescript
import { CalendarApiClient } from '@/lib/google/calendar';

const client = new CalendarApiClient({
  accessToken: 'your-oauth-token'
});

// List events with full control over parameters
const response = await client.listEvents({
  calendarId: 'primary',
  timeMin: new Date().toISOString(),
  maxResults: 50,
  singleEvents: true,
  orderBy: 'startTime'
});

console.log(response.items);
```

### Working with Multiple Calendars

```typescript
// List all calendars
const calendars = await calendar.listCalendars();

for (const cal of calendars) {
  console.log(`${cal.summary} (${cal.id})`);
}

// Create a new calendar
const newCalendar = await calendar.createCalendar('Work Projects', {
  description: 'Calendar for tracking work projects',
  timeZone: 'America/New_York'
});

// Get events from a specific calendar
const events = await calendar.listEvents(
  { maxResults: 10 },
  newCalendar.id
);
```

### Recurring Events

```typescript
import { createWeeklyRecurrence } from '@/lib/google/calendar';

// Create a weekly recurring event
const recurringEvent = await calendar.createEvent({
  summary: 'Weekly Team Standup',
  startTime: new Date('2024-01-15T09:00:00'),
  endTime: new Date('2024-01-15T09:30:00'),
  recurrence: [
    createWeeklyRecurrence(1, ['MO', 'WE', 'FR'], 20) // 20 occurrences
  ]
});
```

### Conference/Meeting Links

```typescript
import { createGoogleMeetConference } from '@/lib/google/calendar';

// Create event with Google Meet
const meetingEvent = await calendar.createEvent({
  summary: 'Video Conference',
  startTime: new Date('2024-01-15T14:00:00'),
  endTime: new Date('2024-01-15T15:00:00'),
  conferenceData: createGoogleMeetConference(),
  attendees: ['team@example.com']
});

// Extract the Meet link
import { getGoogleMeetLink } from '@/lib/google/calendar';
const meetLink = getGoogleMeetLink(meetingEvent);
console.log('Join at:', meetLink);
```

### Free/Busy Queries

```typescript
// Check if a time slot is available
const isFree = await calendar.isTimeFree(
  new Date('2024-01-15T10:00:00'),
  new Date('2024-01-15T11:00:00'),
  ['primary', 'work@example.com']
);

// Get all busy periods
const busyPeriods = await calendar.getBusyPeriods(
  new Date('2024-01-15T00:00:00'),
  new Date('2024-01-15T23:59:59'),
  ['primary']
);

for (const [calendarId, data] of Object.entries(busyPeriods.calendars || {})) {
  console.log(`Busy times for ${calendarId}:`, data.busy);
}
```

### Access Control (ACL)

```typescript
const client = calendar.getClient();

// Share calendar with someone
await client.createAclRule(
  'primary',
  {
    scope: {
      type: 'user',
      value: 'colleague@example.com'
    },
    role: 'reader'
  },
  { sendNotifications: true }
);

// List all ACL rules
const aclRules = await client.listAclRules('primary');
```

## Utility Functions

The library includes many utility functions for working with events:

```typescript
import {
  formatEventTime,
  getEventDuration,
  isEventHappeningNow,
  isAllDayEvent,
  sortEventsByStartTime,
  groupEventsByDate,
  formatTimeUntilEvent
} from '@/lib/google/calendar';

const events = await calendar.getUpcomingEvents(20);

// Format event time
console.log(formatEventTime(events[0])); // "Mon, Jan 15, 10:00 AM - 11:00 AM"

// Get duration
const duration = getEventDuration(events[0]);
console.log(`Duration: ${duration} minutes`);

// Check if happening now
const current = events.find(isEventHappeningNow);

// Sort events
const sorted = sortEventsByStartTime(events);

// Group by date
const grouped = groupEventsByDate(events);
for (const [date, dayEvents] of grouped) {
  console.log(`${date}: ${dayEvents.length} events`);
}

// Time until event
console.log(formatTimeUntilEvent(events[0])); // "in 2 hours"
```

## Authentication

This library requires a valid OAuth 2.0 access token with the appropriate Calendar API scopes:

### Required Scopes

```
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/calendar.events
```

### Token Refresh

```typescript
// Update the access token when it's refreshed
calendar.setAccessToken(newAccessToken);
```

## API Reference

### CalendarService

High-level service for calendar operations.

#### Constructor

```typescript
new CalendarService(config: CalendarServiceConfig)
```

#### Methods

**Events:**
- `createEvent(options)` - Create a new event
- `updateEvent(options)` - Update an existing event
- `deleteEvent(eventId, calendarId?, sendNotifications?)` - Delete an event
- `getEvent(eventId, calendarId?)` - Get a specific event
- `listEvents(options?, calendarId?)` - List events
- `getUpcomingEvents(count?, calendarId?)` - Get upcoming events
- `getTodayEvents(calendarId?)` - Get today's events
- `getEventsInRange(startDate, endDate, calendarId?)` - Get events in date range
- `quickAdd(text, calendarId?, sendNotifications?)` - Quick add using natural language

**Calendars:**
- `listCalendars(options?)` - List all calendars
- `getPrimaryCalendar()` - Get primary calendar
- `createCalendar(summary, options?)` - Create a new calendar

**Free/Busy:**
- `isTimeFree(startTime, endTime, calendarIds?)` - Check if time is free
- `getBusyPeriods(startTime, endTime, calendarIds?)` - Get busy periods
- `findAvailableSlots(startDate, endDate, duration, options?)` - Find available time slots

**Utilities:**
- `setAccessToken(token)` - Update access token
- `setDefaultCalendar(calendarId)` - Set default calendar
- `getClient()` - Get underlying API client

### CalendarApiClient

Low-level API client for direct API access.

#### Constructor

```typescript
new CalendarApiClient(config: CalendarClientConfig)
```

#### Methods

See the [Google Calendar API Reference](https://developers.google.com/calendar/api/v3/reference) for complete method documentation.

## Type Definitions

All types are fully documented and exported:

```typescript
import type {
  CalendarEvent,
  Calendar,
  CalendarListEntry,
  EventDateTime,
  EventAttendee,
  FreeBusyRequest,
  FreeBusyResponse,
  // ... and many more
} from '@/lib/google/calendar';
```

## Error Handling

```typescript
try {
  const event = await calendar.createEvent({
    summary: 'Meeting',
    startTime: new Date(),
    endTime: new Date()
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Calendar API Error:', error.message);
    // Error message includes status code and details
  }
}
```

## Examples

### Example 1: Daily Standup Scheduler

```typescript
async function scheduleDailyStandup() {
  const calendar = new CalendarService({ accessToken });
  
  const event = await calendar.createEvent({
    summary: 'Daily Standup',
    startTime: new Date('2024-01-15T09:00:00'),
    endTime: new Date('2024-01-15T09:15:00'),
    recurrence: [createWeeklyRecurrence(1, ['MO', 'TU', 'WE', 'TH', 'FR'])],
    conferenceData: createGoogleMeetConference(),
    attendees: ['team@example.com'],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 }
      ]
    }
  });
  
  return event;
}
```

### Example 2: Find Next Available Meeting Slot

```typescript
async function findNextMeetingSlot(durationMinutes: number = 30) {
  const calendar = new CalendarService({ accessToken });
  
  const now = new Date();
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + 7);
  
  const slots = await calendar.findAvailableSlots(
    now,
    endOfWeek,
    durationMinutes,
    { minSlots: 1 }
  );
  
  return slots[0] || null;
}
```

### Example 3: Event Conflict Checker

```typescript
import { doEventsOverlap } from '@/lib/google/calendar';

async function checkForConflicts(newEvent: CalendarEvent) {
  const calendar = new CalendarService({ accessToken });
  
  const start = getEventStartTime(newEvent);
  const end = getEventEndTime(newEvent);
  
  if (!start || !end) return [];
  
  const existingEvents = await calendar.getEventsInRange(start, end);
  
  return existingEvents.filter(event => 
    doEventsOverlap(event, newEvent)
  );
}
```

## Contributing

This library is part of the `fin` project. See the main project README for contribution guidelines.

## License

MIT

## Resources

- [Google Calendar API Documentation](https://developers.google.com/calendar/api/v3/reference)
- [OAuth 2.0 for Google APIs](https://developers.google.com/identity/protocols/oauth2)
- [Calendar API Guides](https://developers.google.com/calendar/api/guides/overview)
