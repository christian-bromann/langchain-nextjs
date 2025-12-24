// Auto-generated from waha-swagger.json
// Do not edit manually

export interface Base64File {
    mimetype: string;
    data: string;
}

export interface QRCodeValue {
    value: string;
}

export interface RequestCodeRequest {
    /** Mobile phone number in international format */
    phoneNumber: string;
    /** How would you like to receive the one time code for registration? |sms|voice. Leave empty for Web pairing. */
    method?: string;
}

export interface ChatWootCommandsConfig {
    server: boolean;
    queue?: boolean;
}

export interface ChatWootConversationsConfig {
    /** Process message.ack events to mark ChatWoot conversations as read. Enabled by default. */
    markAsRead?: boolean;
    sort: string;
    status: any[];
}

export interface ChatWootAppConfig {
    url: string;
    accountId: number;
    accountToken: string;
    inboxId: number;
    inboxIdentifier: string;
    linkPreview?: string;
    locale: string;
    templates?: any;
    commands?: ChatWootCommandsConfig;
    conversations?: ChatWootConversationsConfig;
}

export interface CallsAppChannelConfig {
    /** Reject incoming calls for this chat type */
    reject: boolean;
    /** Optional auto-reply message sent after the call is rejected. If empty, no message is sent. */
    message?: string;
}

export interface CallsAppConfig {
    /** Rules applied to direct messages (non-group calls) */
    dm: any;
    /** Rules applied to group calls */
    group: any;
}

export interface App {
    /** Enable or disable this app without deleting it. If omitted, treated as enabled (true). */
    enabled?: boolean;
    id: string;
    session: string;
    app: string;
    config: any;
}

export interface MeInfo {
    id: string;
    lid?: string;
    /** Your id with device number */
    jid?: string;
    pushName: string;
}

export interface ProxyConfig {
    server: string;
    username?: string;
    password?: string;
}

export interface IgnoreConfig {
    /** Ignore a status@broadcast (stories) events */
    status?: boolean;
    /** Ignore groups events */
    groups?: boolean;
    /** Ignore channels events */
    channels?: boolean;
    /** Ignore broadcast events (broadcast list and status) */
    broadcast?: boolean;
}

export interface NowebStoreConfig {
    /** Enable or disable the store for contacts, chats, and messages. */
    enabled: boolean;
    /** Enable full sync on session initialization (when scanning QR code).
  Full sync will download all contacts, chats, and messages from the phone.
  If disabled, only messages early than 90 days will be downloaded and some contacts may be missing. */
    fullSync: boolean;
}

export interface NowebConfig {
    /** Mark the session as online when it connects to the server. */
    markOnline: boolean;
    store?: NowebStoreConfig;
}

export interface WebjsConfig {
    /** Enable emission of special 'tag:*' engine events required for presence.update and message.ack.
  WARNING: Enabling this may have performance and stability impact. Disabled by default. */
    tagsEventsOn?: boolean;
}

export interface HmacConfiguration {
    key?: string;
}

export interface RetriesConfiguration {
    delaySeconds?: number;
    attempts?: number;
    policy?: string;
}

export interface CustomHeader {
    name: string;
    value: string;
}

export interface WebhookConfig {
    /** You can use https://docs.webhook.site/ to test webhooks and see the payload */
    url: string;
    events: any[];
    hmac?: any;
    retries?: any;
    customHeaders?: CustomHeader[];
}

export interface SessionConfig {
    /** Metadata for the session. You'll get 'metadata' in all webhooks. */
    metadata?: any;
    proxy?: any;
    debug?: boolean;
    /** Ignore some events related to specific chats */
    ignore?: any;
    noweb?: any;
    /** WebJS-specific settings. */
    webjs?: any;
    webhooks?: WebhookConfig[];
}

export interface SessionInfo {
    /** Session name (id) */
    name: string;
    /** Apps configured for the session. */
    apps?: App[];
    me?: MeInfo;
    assignedWorker?: string;
    presence: any;
    timestamps: any;
    status: string;
    config?: SessionConfig;
}

export interface SessionCreateRequest {
    /** Session name (id) */
    name?: string;
    /** Apps to be synchronized for this session. */
    apps?: App[];
    /** Start session after creation */
    start?: boolean;
    config?: SessionConfig;
}

export interface SessionDTO {
    /** Session name (id) */
    name: string;
    status: string;
    config?: SessionConfig;
}

export interface SessionUpdateRequest {
    /** Apps to be synchronized for this session. */
    apps?: App[];
    config?: SessionConfig;
}

export interface SessionStartDeprecatedRequest {
    /** Session name (id) */
    name: string;
    config?: SessionConfig;
}

export interface SessionStopDeprecatedRequest {
    /** Session name (id) */
    name: string;
    /** Stop and logout from the session. */
    logout?: boolean;
}

export interface SessionLogoutDeprecatedRequest {
    /** Session name (id) */
    name: string;
}

export interface MyProfile {
    id: string;
    picture: string;
    name: string;
}

export interface ProfileNameRequest {
    name: string;
}

export interface Result {
    success: boolean;
}

export interface ProfileStatusRequest {
    status: string;
}

export interface RemoteFile {
    /** MIME type of the attachment. */
    mimetype: string;
    /** Document file name. Value can be null */
    filename?: string;
    url: string;
}

export interface BinaryFile {
    /** MIME type of the attachment. */
    mimetype: string;
    /** Document file name. Optional */
    filename?: string;
    /** Base64-encoded data of the file */
    data: string;
}

export interface ProfilePictureRequest {
    file: any;
}

export interface MessageTextRequest {
    chatId: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    text: string;
    linkPreview?: boolean;
    linkPreviewHighQuality?: boolean;
    session: string;
}

export interface S3MediaData {
    /** The name of the S3 bucket */
    Bucket: string;
    /** The key of the object in the S3 bucket */
    Key: string;
}

export interface WAMedia {
    /** The URL for the media in the message if any */
    url?: string;
    /** mimetype for the media in the message if any */
    mimetype?: string;
    /** The original filename in mediaUrl in the message if any */
    filename?: string;
    /** S3 attributes for the media in the message if you are using S3 media storage */
    s3?: any;
    /** Error message if there's an error downloading the media */
    error?: any;
}

export interface WALocation {
    latitude: string;
    longitude: string;
    live: boolean;
    name?: string;
    address?: string;
    url?: string;
    description?: string;
    thumbnail?: string;
}

export interface ReplyToMessage {
    /** Message ID */
    id: string;
    participant?: string;
    body?: string;
    /** Raw data from reply's message */
    _data?: any;
}

export interface WAMessage {
    /** Message ID */
    id: string;
    /** Unix timestamp for when the message was created */
    timestamp: number;
    /** ID for the Chat that this message was sent to, except if the message was sent by the current user  */
    from: string;
    /** Indicates if the message was sent by the current user */
    fromMe: boolean;
    /** The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages. */
    source: string;
    /** 
  * ID for who this message is for.
  * If the message is sent by the current user, it will be the Chat to which the message is being sent.
  * If the message is sent by another user, it will be the ID for the current user.
   */
    to: string;
    /** For groups - participant who sent the message */
    participant: string;
    /** Message content */
    body: string;
    /** Indicates if the message has media available for download */
    hasMedia: boolean;
    /** Media object for the message if any and downloaded */
    media?: any;
    /** Use `media.url` instead! The URL for the media in the message if any */
    mediaUrl: string;
    /** ACK status for the message */
    ack: number;
    /** ACK status name for the message */
    ackName: string;
    /** If the message was sent to a group, this field will contain the user that sent the message. */
    author?: string;
    /** Location information contained in the message, if the message is type "location" */
    location?: any;
    /** List of vCards contained in the message. */
    vCards?: any[];
    /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
    _data?: any;
    replyTo?: ReplyToMessage;
}

export interface MessageImageRequest {
    chatId: string;
    file: any;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    caption?: string;
    session: string;
}

export interface MessageFileRequest {
    chatId: string;
    file: any;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    caption?: string;
    session: string;
}

export interface VoiceBinaryFile {
    /** MIME type of the attachment. */
    mimetype: any;
    /** Document file name. Optional */
    filename: any;
    /** Base64-encoded data of the file */
    data: string;
}

export interface VoiceRemoteFile {
    /** MIME type of the attachment. */
    mimetype: any;
    url: string;
}

export interface MessageVoiceRequest {
    chatId: string;
    file: any;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    /** Convert the input file to the required format using ffmpeg before sending */
    convert: boolean;
    session: string;
}

export interface VideoRemoteFile {
    /** MIME type of the attachment. */
    mimetype: any;
    /** Document file name. Optional */
    filename: any;
    url: string;
}

export interface VideoBinaryFile {
    /** MIME type of the attachment. */
    mimetype: any;
    /** Document file name. Optional */
    filename: any;
    /** Base64-encoded data of the file */
    data: string;
}

export interface MessageVideoRequest {
    chatId: string;
    file: any;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    /** Send as video note (aka instant or round video). */
    asNote?: boolean;
    /** Convert the input file to the required format using ffmpeg before sending */
    convert: boolean;
    caption?: string;
    session: string;
}

export interface FileURL {
    url?: string;
}

export interface FileContent {
    /** Base64-encoded data of the file */
    data?: string;
}

export interface LinkPreviewData {
    image?: any;
    url: string;
    title: string;
    description: string;
}

export interface MessageLinkCustomPreviewRequest {
    chatId: string;
    /** The text to send. MUST include the URL provided in preview.url */
    text: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    linkPreviewHighQuality?: boolean;
    preview: LinkPreviewData;
    session: string;
}

export interface Button {
    text: string;
    id?: string;
    url?: string;
    phoneNumber?: string;
    copyCode?: string;
    type: string;
}

export interface SendButtonsRequest {
    chatId: string;
    header: string;
    headerImage?: any;
    body: string;
    footer: string;
    buttons: Button[];
    session: string;
}

export interface Row {
    title: string;
    description?: string;
    rowId: string;
}

export interface Section {
    title: string;
    rows: Row[];
}

export interface SendListMessage {
    title: string;
    description?: string;
    footer?: string;
    button: string;
    sections: Section[];
}

export interface SendListRequest {
    chatId: string;
    message: any;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    session: string;
}

export interface MessageForwardRequest {
    chatId: string;
    messageId: string;
    session: string;
}

export interface SendSeenRequest {
    chatId: string;
    messageId?: string;
    messageIds?: any[];
    /** NOWEB engine only - the ID of the user that sent the message (undefined for individual chats) */
    participant?: string;
    session: string;
}

export interface ChatRequest {
    chatId: string;
    session: string;
}

export interface MessageReactionRequest {
    messageId: string;
    /** Emoji to react with. Send an empty string to remove the reaction */
    reaction: string;
    session: string;
}

export interface MessageStarRequest {
    messageId: string;
    chatId: string;
    star: boolean;
    session: string;
}

export interface MessagePoll {
    name: string;
    options: any[];
    multipleAnswers: any;
}

export interface MessagePollRequest {
    chatId: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    poll: MessagePoll;
    session: string;
}

export interface MessagePollVoteRequest {
    chatId: string;
    /** The ID of the poll message. Format: {fromMe}_{chatID}_{messageId}[_{participant}] or just ID for GOWS */
    pollMessageId: string;
    /** Only for Channels - server message id (if known); if omitted, API may look it up in the storage */
    pollServerId?: number;
    votes: any[];
    session: string;
}

export interface MessageLocationRequest {
    chatId: string;
    latitude: number;
    longitude: number;
    title: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    session: string;
}

export interface Contact {
    /** The full name of the contact */
    fullName: string;
    /** The organization of the contact */
    organization?: string;
    /** The phone number of the contact */
    phoneNumber: string;
    /** The whatsapp id of the contact. DO NOT add + or @c.us */
    whatsappId?: string;
    vcard: string;
}

export interface VCardContact {
    /** The vcard string */
    vcard: string;
}

export interface MessageContactVcardRequest {
    chatId: string;
    contacts: any[];
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    session: string;
}

export interface MessageButtonReply {
    chatId: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    replyTo?: string;
    selectedDisplayText: string;
    selectedButtonID: string;
    session: string;
}

export interface WANumberExistResult {
    chatId?: string;
    numberExists: boolean;
}

export interface MessageReplyRequest {
    chatId: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    text: string;
    linkPreview?: boolean;
    linkPreviewHighQuality?: boolean;
    session: string;
}

export interface MessageLinkPreviewRequest {
    chatId: string;
    session: string;
    url: string;
    title: string;
}

export interface ChatSummary {
    id: string;
    name: string;
    picture: string;
    lastMessage: any;
    _chat: any;
}

export interface OverviewPaginationParams {
    limit?: number;
    offset?: number;
}

export interface OverviewFilter {
    /** Filter by chat ids */
    ids?: any[];
}

export interface OverviewBodyRequest {
    pagination: OverviewPaginationParams;
    filter: OverviewFilter;
}

export interface ChatPictureResponse {
    url: string;
}

export interface ReadChatMessagesResponse {
    /** Messages IDs that have been read */
    ids?: any[];
}

export interface PinMessageRequest {
    /** Duration in seconds. 24 hours (86400), 7 days (604800), 30 days (2592000) */
    duration: number;
}

export interface EditMessageRequest {
    text: string;
    linkPreview?: boolean;
    linkPreviewHighQuality?: boolean;
}

export interface RejectCallRequest {
    from: string;
    /** Call ID */
    id: string;
}

export interface Channel {
    /** Newsletter id */
    id: string;
    /** Channel name */
    name: string;
    /** Invite link */
    invite: string;
    /** Preview for channel's picture */
    preview?: string;
    /** Channel's picture */
    picture?: string;
    role: string;
    description?: string;
    verified: boolean;
    subscribersCount: number;
}

export interface CreateChannelRequest {
    name: string;
    description?: string;
    picture?: any;
}

export interface ChannelMessage {
    reactions: any;
    message: WAMessage;
    viewCount: number;
}

export interface ChannelSearchByView {
    view: string;
    countries: any[];
    categories: any[];
    limit: number;
    startCursor: string;
}

export interface ChannelPagination {
    startCursor: string;
    endCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ChannelPublicInfo {
    /** Newsletter id */
    id: string;
    /** Channel name */
    name: string;
    /** Invite link */
    invite: string;
    /** Preview for channel's picture */
    preview?: string;
    /** Channel's picture */
    picture?: string;
    description?: string;
    verified: boolean;
    subscribersCount: number;
}

export interface ChannelListResult {
    page: ChannelPagination;
    channels: ChannelPublicInfo[];
}

export interface ChannelSearchByText {
    text: string;
    categories: any[];
    limit: number;
    startCursor: string;
}

export interface ChannelView {
    value: string;
    name: string;
}

export interface ChannelCountry {
    code: string;
    name: string;
}

export interface ChannelCategory {
    value: string;
    name: string;
}

export interface TextStatus {
    /** Pre-generated status message id */
    id?: string;
    /** Contact list to send the status to. */
    contacts?: any[];
    text: string;
    backgroundColor: string;
    font: number;
    linkPreview?: boolean;
    linkPreviewHighQuality?: boolean;
}

export interface ImageStatus {
    /** Pre-generated status message id */
    id?: string;
    /** Contact list to send the status to. */
    contacts?: any[];
    file: any;
    caption?: string;
}

export interface VoiceStatus {
    /** Pre-generated status message id */
    id?: string;
    /** Contact list to send the status to. */
    contacts?: any[];
    file: any;
    /** Convert the input file to the required format using ffmpeg before sending */
    convert: boolean;
    backgroundColor: string;
}

export interface VideoStatus {
    /** Pre-generated status message id */
    id?: string;
    /** Contact list to send the status to. */
    contacts?: any[];
    file: any;
    /** Convert the input file to the required format using ffmpeg before sending */
    convert: boolean;
    caption?: string;
}

export interface DeleteStatusRequest {
    /** Status message id to delete */
    id?: string;
    /** Contact list to send the status to. */
    contacts?: any[];
}

export interface NewMessageIDResponse {
    /** Pre-generated message id */
    id: string;
}

export interface Label {
    /** Label ID */
    id: string;
    /** Label name */
    name: string;
    /** Color number, not hex */
    color: number;
    /** Color in hex */
    colorHex: string;
}

export interface LabelBody {
    /** Label name */
    name: string;
    /** Color in hex */
    colorHex?: string;
    /** Color number, not hex */
    color?: number;
}

export interface LabelID {
    /** Label ID */
    id: string;
}

export interface SetLabelsRequest {
    labels: LabelID[];
}

export interface ContactRequest {
    contactId: string;
    session: string;
}

export interface ContactUpdateBody {
    /** Contact First Name */
    firstName: string;
    /** Contact Last Name */
    lastName: string;
}

export interface LidToPhoneNumber {
    /** Linked ID for the user */
    lid?: string;
    /** Phone number (chat id) for the user */
    pn?: string;
}

export interface CountResponse {
    count: number;
}

export interface Participant {
    id: string;
}

export interface CreateGroupRequest {
    name: string;
    participants: Participant[];
}

export interface JoinGroupRequest {
    /** Group code (123) or url (https://chat.whatsapp.com/123) */
    code: string;
}

export interface JoinGroupResponse {
    /** Group ID */
    id: string;
}

export interface DescriptionRequest {
    description: string;
}

export interface SubjectRequest {
    subject: string;
}

export interface SettingsSecurityChangeInfo {
    adminsOnly: boolean;
}

export interface GroupParticipant {
    /** Member ID in @c.us or @lid format */
    id: string;
    /** Member ID in @c.us format */
    pn?: string;
    role: string;
}

export interface ParticipantsRequest {
    participants: Participant[];
}

export interface WAHASessionPresence {
    /** Chat ID - either group id or contact id */
    chatId: string;
    presence: string;
}

export interface WAHAPresenceData {
    /** Chat ID - participant or contact id */
    participant: string;
    lastSeen?: number;
    lastKnownPresence: string;
}

export interface WAHAChatPresences {
    /** Chat ID - either group id or contact id */
    id: string;
    presences: WAHAPresenceData[];
}

export interface EventLocation {
    /** Name of the location */
    name: string;
}

export interface EventMessage {
    /** Name of the event */
    name: string;
    /** Description of the event */
    description?: string;
    /** Start time of the event (Unix timestamp in seconds) */
    startTime: number;
    /** End time of the event (Unix timestamp in seconds) */
    endTime?: number;
    /** Location of the event */
    location?: any;
    /** Whether extra guests are allowed */
    extraGuestsAllowed?: boolean;
}

export interface EventMessageRequest {
    chatId: string;
    /** The ID of the message to reply to - false_11111111111@c.us_AAAAAAAAAAAAAAAAAAAA */
    reply_to?: string;
    event: EventMessage;
}

export interface PingResponse {
    message: string;
}

export interface WAHAEnvironment {
    version: string;
    engine: string;
    tier: string;
    browser: string;
}

export interface WorkerInfo {
    /** The worker ID. */
    id: string;
}

export interface ServerStatusResponse {
    /** The timestamp when the server started (milliseconds). */
    startTimestamp: number;
    /** The uptime of the server in milliseconds. */
    uptime: number;
    worker: WorkerInfo;
}

export interface StopRequest {
    /** By default, it gracefully stops the server, but you can force it to terminate immediately. */
    force?: boolean;
}

export interface StopResponse {
    /** Always 'true' if the server is stopping. */
    stopping: boolean;
}

export interface VoiceFileDTO {
    /** The URL for the voice file */
    url?: string;
    /** Base64 content of the file */
    data?: string;
}

export interface VideoFileDTO {
    /** The URL for the video file */
    url?: string;
    /** Base64 content of the file */
    data?: string;
}

export interface SessionStatusPoint {
    status: string;
    timestamp: number;
}

export interface WASessionStatusBody {
    name: string;
    status: string;
    statuses: SessionStatusPoint[];
}

export interface WAHAWebhookSessionStatus {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the session status changes. */
    event: any;
    payload: WASessionStatusBody;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookMessage {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Incoming message. */
    event: any;
    payload: WAMessage;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAReaction {
    /** Reaction to the message. Either the reaction (emoji) or empty string to remove the reaction */
    text: string;
    /** Message ID for the message to react to */
    messageId: string;
}

export interface WAMessageReaction {
    /** Message ID */
    id: string;
    /** Unix timestamp for when the message was created */
    timestamp: number;
    /** ID for the Chat that this message was sent to, except if the message was sent by the current user  */
    from: string;
    /** Indicates if the message was sent by the current user */
    fromMe: boolean;
    /** The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages. */
    source: string;
    /** 
  * ID for who this message is for.
  * If the message is sent by the current user, it will be the Chat to which the message is being sent.
  * If the message is sent by another user, it will be the ID for the current user.
   */
    to: string;
    /** For groups - participant who sent the message */
    participant: string;
    /** Reaction to the message. Either the reaction (emoji) or empty string to remove the reaction */
    reaction: any;
}

export interface WAHAWebhookMessageReaction {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a user reacts or removes a reaction. */
    event: any;
    payload: WAMessageReaction;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookMessageAny {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Fired on all message creations, including your own. */
    event: any;
    payload: WAMessage;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAMessageAckBody {
    /** Message ID */
    id: string;
    from: string;
    to: string;
    participant: string;
    fromMe: boolean;
    ack: number;
    ackName: string;
    _data?: any;
}

export interface WAHAWebhookMessageAck {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Receive events when server or recipient gets the message, read or played it. */
    event: any;
    payload: WAMessageAckBody;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAMessageRevokedBody {
    /** ID of the message that was revoked */
    revokedMessageId?: string;
    after?: WAMessage;
    before?: WAMessage;
    _data?: any;
}

export interface WAHAWebhookMessageRevoked {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a user, whether it be you or any other participant, revokes a previously sent message. */
    event: any;
    payload: WAMessageRevokedBody;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAMessageEditedBody {
    /** Message ID */
    id: string;
    /** Unix timestamp for when the message was created */
    timestamp: number;
    /** ID for the Chat that this message was sent to, except if the message was sent by the current user  */
    from: string;
    /** Indicates if the message was sent by the current user */
    fromMe: boolean;
    /** The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages. */
    source: string;
    /** 
  * ID for who this message is for.
  * If the message is sent by the current user, it will be the Chat to which the message is being sent.
  * If the message is sent by another user, it will be the ID for the current user.
   */
    to: string;
    /** For groups - participant who sent the message */
    participant: string;
    /** Message content */
    body: string;
    /** Indicates if the message has media available for download */
    hasMedia: boolean;
    /** Media object for the message if any and downloaded */
    media?: any;
    /** Use `media.url` instead! The URL for the media in the message if any */
    mediaUrl: string;
    /** ACK status for the message */
    ack: number;
    /** ACK status name for the message */
    ackName: string;
    /** If the message was sent to a group, this field will contain the user that sent the message. */
    author?: string;
    /** Location information contained in the message, if the message is type "location" */
    location?: any;
    /** List of vCards contained in the message. */
    vCards?: any[];
    /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
    _data?: any;
    /** ID of the original message that was edited */
    editedMessageId?: string;
    replyTo?: ReplyToMessage;
}

export interface WAHAWebhookMessageEdited {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a user edits a previously sent message. */
    event: any;
    payload: WAMessageEditedBody;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface GroupInfo {
    id: string;
    subject: string;
    description: string;
    /** Invite URL */
    invite?: string;
    /** Members can add new members */
    membersCanAddNewMember: boolean;
    /** Members can send messages to the group */
    membersCanSendMessages: boolean;
    /** Admin approval required for new members */
    newMembersApprovalRequired: boolean;
    participants: GroupParticipant[];
}

export interface GroupV2JoinEvent {
    /** Unix timestamp */
    timestamp: number;
    group: GroupInfo;
    _data: any;
}

export interface WebhookGroupV2Join {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** When you joined or were added to a group */
    event: any;
    payload: GroupV2JoinEvent;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface GroupId {
    id: string;
}

export interface GroupV2LeaveEvent {
    /** Unix timestamp */
    timestamp: number;
    group: GroupId;
    _data: any;
}

export interface WebhookGroupV2Leave {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** When you left or were removed from a group */
    event: any;
    payload: GroupV2LeaveEvent;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface GroupV2UpdateEvent {
    /** Unix timestamp */
    timestamp: number;
    group: any;
    _data: any;
}

export interface WebhookGroupV2Update {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** When group info is updated */
    event: any;
    payload: GroupV2UpdateEvent;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface GroupV2ParticipantsEvent {
    /** Type of the event */
    type: string;
    /** Unix timestamp */
    timestamp: number;
    group: GroupId;
    participants: GroupParticipant[];
    _data: any;
}

export interface WebhookGroupV2Participants {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** When participants changed - join, leave, promote to admin */
    event: any;
    payload: GroupV2ParticipantsEvent;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookPresenceUpdate {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The most recent presence information for a chat. */
    event: any;
    payload: WAHAChatPresences;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface PollVote {
    /** Message ID */
    id: string;
    /** Option that user has selected */
    selectedOptions: any[];
    /** Timestamp, ms */
    timestamp: number;
    to: string;
    from: string;
    fromMe: boolean;
    participant?: string;
}

export interface MessageDestination {
    /** Message ID */
    id: string;
    to: string;
    from: string;
    fromMe: boolean;
    participant?: string;
}

export interface PollVotePayload {
    vote: PollVote;
    poll: MessageDestination;
    _data?: any;
}

export interface WAHAWebhookPollVote {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** With this event, you receive new votes for the poll sent. */
    event: any;
    payload: PollVotePayload;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookPollVoteFailed {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** There may be cases when it fails to decrypt a vote from the user. Read more about how to handle such events in the documentations. */
    event: any;
    payload: PollVotePayload;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface ChatArchiveEvent {
    id: string;
    archived: boolean;
    timestamp: number;
}

export interface WAHAWebhookChatArchive {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the chat is archived or unarchived */
    event: any;
    payload: ChatArchiveEvent;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface CallData {
    /** Call ID */
    id: string;
    from?: string;
    timestamp: number;
    isVideo: boolean;
    isGroup: boolean;
    _data: any;
}

export interface WAHAWebhookCallReceived {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the call is received by the user. */
    event: any;
    payload: CallData;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookCallAccepted {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the call is accepted by the user. */
    event: any;
    payload: CallData;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookCallRejected {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the call is rejected by the user. */
    event: any;
    payload: CallData;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookLabelUpsert {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a label is created or updated */
    event: any;
    payload: Label;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookLabelDeleted {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a label is deleted */
    event: any;
    payload: Label;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface LabelChatAssociation {
    /** Label ID */
    labelId: string;
    /** Chat ID */
    chatId: string;
    label: any;
}

export interface WAHAWebhookLabelChatAdded {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a label is added to a chat */
    event: any;
    payload: LabelChatAssociation;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookLabelChatDeleted {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when a label is deleted from a chat */
    event: any;
    payload: LabelChatAssociation;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface EventResponse {
    response: string;
    timestampMs: number;
    extraGuestCount: number;
}

export interface EventResponsePayload {
    /** Message ID */
    id: string;
    /** Unix timestamp for when the message was created */
    timestamp: number;
    /** ID for the Chat that this message was sent to, except if the message was sent by the current user  */
    from: string;
    /** Indicates if the message was sent by the current user */
    fromMe: boolean;
    /** The device that sent the message - either API or APP. Available in events (webhooks/websockets) only and only "fromMe: true" messages. */
    source: string;
    /** 
  * ID for who this message is for.
  * If the message is sent by the current user, it will be the Chat to which the message is being sent.
  * If the message is sent by another user, it will be the ID for the current user.
   */
    to: string;
    /** For groups - participant who sent the message */
    participant: string;
    /** Message in a raw format that we get from WhatsApp. May be changed anytime, use it with caution! It depends a lot on the underlying backend. */
    _data?: any;
    eventCreationKey: MessageDestination;
    eventResponse?: EventResponse;
}

export interface WAHAWebhookEventResponse {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the event response is received. */
    event: any;
    payload: EventResponsePayload;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookEventResponseFailed {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** The event is triggered when the event response is failed to decrypt. */
    event: any;
    payload: EventResponsePayload;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface EnginePayload {
    event: string;
    data: any;
}

export interface WAHAWebhookEngineEvent {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Internal engine event. */
    event: any;
    payload: EnginePayload;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookGroupJoin {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Some one join a group. */
    event: any;
    payload: any;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookGroupLeave {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** Some one left a group. */
    event: any;
    payload: any;
    me?: MeInfo;
    environment: WAHAEnvironment;
}

export interface WAHAWebhookStateChange {
    /** Unique identifier for the event - lower case ULID format. https://github.com/ulid/spec */
    id: string;
    /** Unix timestamp (ms) for when the event was created. */
    timestamp: number;
    session: string;
    /** Metadata for the session. */
    metadata?: any;
    engine: string;
    /** It’s an internal engine’s state, not session status. */
    event: any;
    payload: any;
    me?: MeInfo;
    environment: WAHAEnvironment;
}


export interface WahaClientConfig {
    baseUrl: string;
    apiKey: string;
}

export class WahaClient {
    private config: WahaClientConfig;

    constructor(config: WahaClientConfig) {
        this.config = config;
    }

    private async request<T>(
        path: string,
        method: string = 'GET',
        body?: any
    ): Promise<T> {
        const url = `${this.config.baseUrl}${path}`;
        const headers: Record<string, string> = {
            'X-Api-Key': this.config.apiKey,
        };

        if (body) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`WAHA API Error: ${error}`);
        }

        return response.json();
    }

    /**
     * Send a text message
     */
    async sendText(data: MessageTextRequest): Promise<WAMessage> {
        return this.request<WAMessage>('/api/sendText', 'POST', data);
    }

    /**
     * Send an image
     */
    async sendImage(data: MessageImageRequest): Promise<any> {
        return this.request<any>('/api/sendImage', 'POST', data);
    }

    /**
     * Send a file
     */
    async sendFile(data: MessageFileRequest): Promise<any> {
        return this.request<any>('/api/sendFile', 'POST', data);
    }

    /**
     * Send an voice message
     */
    async sendVoice(data: MessageVoiceRequest): Promise<any> {
        return this.request<any>('/api/sendVoice', 'POST', data);
    }

    /**
     * Send a video
     */
    async sendVideo(data: MessageVideoRequest): Promise<any> {
        return this.request<any>('/api/sendVideo', 'POST', data);
    }

    /**
     * sendLocation
     */
    async sendLocation(data: MessageLocationRequest): Promise<any> {
        return this.request<any>('/api/sendLocation', 'POST', data);
    }

    /**
     * sendLinkPreview
     */
    async sendLinkPreview(data: MessageLinkPreviewRequest): Promise<any> {
        return this.request<any>('/api/sendLinkPreview', 'POST', data);
    }

    /**
     * sendSeen
     */
    async sendSeen(data: SendSeenRequest): Promise<any> {
        return this.request<any>('/api/sendSeen', 'POST', data);
    }

    /**
     * startTyping
     */
    async startTyping(data: ChatRequest): Promise<any> {
        return this.request<any>('/api/startTyping', 'POST', data);
    }

    /**
     * stopTyping
     */
    async stopTyping(data: ChatRequest): Promise<any> {
        return this.request<any>('/api/stopTyping', 'POST', data);
    }

    /**
     * List all sessions
     */
    async getSessions(): Promise<any> {
        return this.request<any>('/api/sessions', 'GET');
    }

    /**
     * Create a session
     */
    async createSession(data: SessionCreateRequest): Promise<SessionDTO> {
        return this.request<SessionDTO>('/api/sessions', 'POST', data);
    }
}