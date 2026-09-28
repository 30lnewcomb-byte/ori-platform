# Ori Chat

Chat is the primary user-facing feature of Ori.

## Conversation model

A conversation contains an ordered sequence of user and Ori assistant messages.

The web client keeps the current conversation in memory while it is open and stores saved conversations in browser local storage.

## New Chat

New Chat creates a new conversation ID. It does not overwrite the previous conversation.

The current chat is addressable by a URL query such as:

`/chat?chat=<conversation-id>`

Home's “Start a new chat” entry point explicitly creates a new conversation.

## History

Current history behavior is local-first.

The browser stores up to 100 conversations using the `ori.chat.history.v1` storage key.

A saved conversation contains:

- an ID
- an automatically generated title
- ordered messages
- created timestamp
- updated timestamp

## Titles

The first user message becomes the title after whitespace is normalized. Titles are limited to keep the history rail readable.

## Delete

Saved conversations can be removed individually. Deleting the active conversation moves the user to another saved conversation when available, or creates a fresh conversation.

## Refresh behavior

Refreshing the page does not erase browser-local history.

Opening `/chat` with no chat ID resumes the most recently updated saved conversation when one exists.

## Future server-side history

Browser-local history is the current implementation because it provides useful behavior without introducing account infrastructure prematurely.

Later, authenticated server-side history can replace or supplement local storage so conversations can persist across devices. The chat UI is designed so the storage layer can change without redefining the conversation model.
