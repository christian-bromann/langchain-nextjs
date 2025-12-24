# TRD – Agent & Tools Design

## LangChain Agent
- Tool-calling agent
- Stateless execution
- Context loaded from database

## Agent Responsibilities
- Intent detection
- Parameter validation
- Tool selection
- Clarification handling

## Google Calendar Tool (MVP)

Supported actions:
- createEvent
- listEvents
- updateEvent
- deleteEvent

## Tool Injection Pattern
- OAuth tokens injected per request
- No global credentials
