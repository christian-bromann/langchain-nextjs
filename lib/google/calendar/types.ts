/**
 * Google Calendar API Type Definitions
 * Based on: https://developers.google.com/calendar/api/v3/reference
 */

// ============================================================================
// Event Types
// ============================================================================

export interface CalendarEvent {
    kind?: 'calendar#event';
    etag?: string;
    id?: string;
    status?: 'confirmed' | 'tentative' | 'cancelled';
    htmlLink?: string;
    created?: string;
    updated?: string;
    summary?: string;
    description?: string;
    location?: string;
    colorId?: string;
    creator?: {
        id?: string;
        email?: string;
        displayName?: string;
        self?: boolean;
    };
    organizer?: {
        id?: string;
        email?: string;
        displayName?: string;
        self?: boolean;
    };
    start?: EventDateTime;
    end?: EventDateTime;
    endTimeUnspecified?: boolean;
    recurrence?: string[];
    recurringEventId?: string;
    originalStartTime?: EventDateTime;
    transparency?: 'opaque' | 'transparent';
    visibility?: 'default' | 'public' | 'private' | 'confidential';
    iCalUID?: string;
    sequence?: number;
    attendees?: EventAttendee[];
    attendeesOmitted?: boolean;
    extendedProperties?: {
        private?: Record<string, string>;
        shared?: Record<string, string>;
    };
    hangoutLink?: string;
    conferenceData?: ConferenceData;
    gadget?: {
        type?: string;
        title?: string;
        link?: string;
        iconLink?: string;
        width?: number;
        height?: number;
        display?: 'icon' | 'chip';
        preferences?: Record<string, string>;
    };
    anyoneCanAddSelf?: boolean;
    guestsCanInviteOthers?: boolean;
    guestsCanModify?: boolean;
    guestsCanSeeOtherGuests?: boolean;
    privateCopy?: boolean;
    locked?: boolean;
    reminders?: {
        useDefault?: boolean;
        overrides?: EventReminder[];
    };
    source?: {
        url?: string;
        title?: string;
    };
    attachments?: EventAttachment[];
    eventType?: 'default' | 'outOfOffice' | 'focusTime' | 'workingLocation';
    workingLocationProperties?: {
        type?: 'homeOffice' | 'officeLocation' | 'customLocation';
        homeOffice?: any;
        officeLocation?: {
            buildingId?: string;
            floorId?: string;
            floorSectionId?: string;
            deskId?: string;
            label?: string;
        };
        customLocation?: {
            label?: string;
        };
    };
    outOfOfficeProperties?: {
        autoDeclineMode?: 'declineNone' | 'declineAllConflictingInvitations' | 'declineOnlyNewConflictingInvitations';
        declineMessage?: string;
    };
    focusTimeProperties?: {
        autoDeclineMode?: 'declineNone' | 'declineAllConflictingInvitations' | 'declineOnlyNewConflictingInvitations';
        declineMessage?: string;
        chatStatus?: 'available' | 'doNotDisturb';
    };
}

export interface EventDateTime {
    date?: string; // Format: yyyy-mm-dd
    dateTime?: string; // RFC3339 timestamp
    timeZone?: string; // IANA Time Zone Database name
}

export interface EventAttendee {
    id?: string;
    email?: string;
    displayName?: string;
    organizer?: boolean;
    self?: boolean;
    resource?: boolean;
    optional?: boolean;
    responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    comment?: string;
    additionalGuests?: number;
}

export interface EventReminder {
    method: 'email' | 'popup';
    minutes: number;
}

export interface EventAttachment {
    fileUrl?: string;
    title?: string;
    mimeType?: string;
    iconLink?: string;
    fileId?: string;
}

export interface ConferenceData {
    createRequest?: {
        requestId?: string;
        conferenceSolutionKey?: {
            type?: string;
        };
        status?: {
            statusCode?: 'pending' | 'success' | 'failure';
        };
    };
    entryPoints?: ConferenceEntryPoint[];
    conferenceSolution?: {
        key?: {
            type?: string;
        };
        name?: string;
        iconUri?: string;
    };
    conferenceId?: string;
    signature?: string;
    notes?: string;
}

export interface ConferenceEntryPoint {
    entryPointType?: 'video' | 'phone' | 'sip' | 'more';
    uri?: string;
    label?: string;
    pin?: string;
    accessCode?: string;
    meetingCode?: string;
    passcode?: string;
    password?: string;
    regionCode?: string;
}

// ============================================================================
// Calendar Types
// ============================================================================

export interface Calendar {
    kind?: 'calendar#calendar';
    etag?: string;
    id?: string;
    summary?: string;
    description?: string;
    location?: string;
    timeZone?: string;
    conferenceProperties?: {
        allowedConferenceSolutionTypes?: string[];
    };
}

export interface CalendarListEntry {
    kind?: 'calendar#calendarListEntry';
    etag?: string;
    id?: string;
    summary?: string;
    description?: string;
    location?: string;
    timeZone?: string;
    summaryOverride?: string;
    colorId?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    hidden?: boolean;
    selected?: boolean;
    accessRole?: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
    defaultReminders?: EventReminder[];
    notificationSettings?: {
        notifications?: CalendarNotification[];
    };
    primary?: boolean;
    deleted?: boolean;
    conferenceProperties?: {
        allowedConferenceSolutionTypes?: string[];
    };
}

export interface CalendarNotification {
    type: 'eventCreation' | 'eventChange' | 'eventCancellation' | 'eventResponse' | 'agenda';
    method: 'email' | 'sms';
}

// ============================================================================
// ACL Types
// ============================================================================

export interface AclRule {
    kind?: 'calendar#aclRule';
    etag?: string;
    id?: string;
    scope?: {
        type?: 'default' | 'user' | 'group' | 'domain';
        value?: string;
    };
    role?: 'freeBusyReader' | 'reader' | 'writer' | 'owner';
}

// ============================================================================
// FreeBusy Types
// ============================================================================

export interface FreeBusyRequest {
    timeMin: string;
    timeMax: string;
    timeZone?: string;
    groupExpansionMax?: number;
    calendarExpansionMax?: number;
    items: { id: string }[];
}

export interface FreeBusyResponse {
    kind?: 'calendar#freeBusy';
    timeMin?: string;
    timeMax?: string;
    groups?: Record<string, {
        errors?: FreeBusyError[];
        calendars?: string[];
    }>;
    calendars?: Record<string, {
        errors?: FreeBusyError[];
        busy?: TimePeriod[];
    }>;
}

export interface TimePeriod {
    start?: string;
    end?: string;
}

export interface FreeBusyError {
    domain?: string;
    reason?: string;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface Setting {
    kind?: 'calendar#setting';
    etag?: string;
    id?: string;
    value?: string;
}

// ============================================================================
// Colors Types
// ============================================================================

export interface Colors {
    kind?: 'calendar#colors';
    updated?: string;
    calendar?: Record<string, ColorDefinition>;
    event?: Record<string, ColorDefinition>;
}

export interface ColorDefinition {
    background?: string;
    foreground?: string;
}

// ============================================================================
// List Response Types
// ============================================================================

export interface EventsListResponse {
    kind?: 'calendar#events';
    etag?: string;
    summary?: string;
    description?: string;
    updated?: string;
    timeZone?: string;
    accessRole?: string;
    defaultReminders?: EventReminder[];
    nextPageToken?: string;
    nextSyncToken?: string;
    items?: CalendarEvent[];
}

export interface CalendarListResponse {
    kind?: 'calendar#calendarList';
    etag?: string;
    nextPageToken?: string;
    nextSyncToken?: string;
    items?: CalendarListEntry[];
}

export interface AclListResponse {
    kind?: 'calendar#acl';
    etag?: string;
    nextPageToken?: string;
    nextSyncToken?: string;
    items?: AclRule[];
}

export interface SettingsListResponse {
    kind?: 'calendar#settings';
    etag?: string;
    nextPageToken?: string;
    nextSyncToken?: string;
    items?: Setting[];
}

// ============================================================================
// Query Parameter Types
// ============================================================================

export interface EventsListParams {
    calendarId: string;
    alwaysIncludeEmail?: boolean;
    eventTypes?: ('default' | 'focusTime' | 'outOfOffice' | 'workingLocation')[];
    iCalUID?: string;
    maxAttendees?: number;
    maxResults?: number;
    orderBy?: 'startTime' | 'updated';
    pageToken?: string;
    privateExtendedProperty?: string[];
    q?: string;
    sharedExtendedProperty?: string[];
    showDeleted?: boolean;
    showHiddenInvitations?: boolean;
    singleEvents?: boolean;
    syncToken?: string;
    timeMin?: string;
    timeMax?: string;
    timeZone?: string;
    updatedMin?: string;
}

export interface EventsInsertParams {
    calendarId: string;
    conferenceDataVersion?: number;
    maxAttendees?: number;
    sendNotifications?: boolean;
    sendUpdates?: 'all' | 'externalOnly' | 'none';
    supportsAttachments?: boolean;
}

export interface EventsUpdateParams {
    calendarId: string;
    eventId: string;
    alwaysIncludeEmail?: boolean;
    conferenceDataVersion?: number;
    maxAttendees?: number;
    sendNotifications?: boolean;
    sendUpdates?: 'all' | 'externalOnly' | 'none';
    supportsAttachments?: boolean;
}

export interface EventsDeleteParams {
    calendarId: string;
    eventId: string;
    sendNotifications?: boolean;
    sendUpdates?: 'all' | 'externalOnly' | 'none';
}

export interface QuickAddParams {
    calendarId: string;
    text: string;
    sendNotifications?: boolean;
    sendUpdates?: 'all' | 'externalOnly' | 'none';
}

// ============================================================================
// Error Types
// ============================================================================

export interface CalendarApiError {
    error: {
        code: number;
        message: string;
        errors?: Array<{
            domain: string;
            reason: string;
            message: string;
            locationType?: string;
            location?: string;
        }>;
        status: string;
    };
}
