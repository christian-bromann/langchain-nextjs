# PRD – LangChain Agent Design

## Agent Type
- Tool-calling agent (OpenAI Functions style)

## Responsibilities
- Parse user intent
- Select correct Google tool
- Ask clarification if needed
- Avoid assumptions

## Prompt Rules
- Never guess date or time
- Ask if input is ambiguous
- Confirm before deleting events
- Respond politely and concisely
