# Ori — Product Overview

Ori is a user-owned AI platform built around a focused conversation experience, native learned intelligence, controlled work execution, and clear system boundaries.

## What Ori is

Ori is not just a chat page. It is the product layer that coordinates conversation, intelligence, tools, work context, and future project capabilities.

The current product is intentionally smaller than the long-term design. The web application currently focuses on the part that is real and useful now: talking with Ori and continuing those conversations.

## Product principles

- **User-owned:** the platform is designed around user control and transparent boundaries.
- **Truthful:** the UI does not claim that work happened when the system has not confirmed it.
- **Focused:** only capabilities with real behavior belong in the primary experience.
- **Human:** Ori should feel approachable without becoming gimmicky.
- **Technical:** powerful infrastructure should remain behind understandable product boundaries.
- **Calm:** important state should be visible without unnecessary noise.
- **Native intelligence:** Ori's production intelligence path is designed around Ori-owned TensorFlow/Keras models.

## Current product surfaces

### Home

Home is the starting point for Ori. It provides a direct path into a new conversation and explains the currently available capabilities.

### Chat

Chat is the primary working surface.

Chat currently supports:

- sending messages to Ori
- multi-turn context within a conversation
- creating a new conversation
- automatic conversation titles based on the first user message
- local browser persistence
- reopening saved conversations
- deleting saved conversations
- per-conversation URLs

### Developer Platform

The Developer Platform is a separate in-app experience for understanding and eventually building against Ori's platform interfaces.

## Surfaces intentionally not exposed as primary features

Search, Projects, Tasks, and Activity are part of the longer-term Ori product design, but they are not primary navigation items until their underlying functionality is real.

This is deliberate. A product surface should not look complete merely because a page can be rendered.

## Ori World

Ori World is the planned controlled working environment for code, files, tests, experiments, and approved execution. The current implementation prepares the server-side VM boundary, but full Ori World orchestration is not yet a finished user feature.

## Settings

Settings are not a broad control surface yet. The product should only expose controls once the underlying persistence, identity, or runtime-management behavior exists.

## Relationship to OriOS Lite

Ori Platform and OriOS Lite are separate projects. OriOS Lite is not a required dependency of the web platform.
