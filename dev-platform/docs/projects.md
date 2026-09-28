# Ori Developer Projects

Projects are intended to be the durable unit for developer work on Ori.

## A project can eventually own

- application configuration
- API credentials
- tool access
- model settings
- activity and events
- project resources
- developer-owned integration data

## Why projects exist

A project gives a developer a clear boundary instead of making every resource global to an entire account.

## Current status

The project model is defined and documented, but durable authenticated project creation and storage are not enabled.

The Developer Console therefore reports the project surface as foundation-ready rather than pretending project creation already works.

## Future lifecycle

```
Create project
   ↓
Configure project
   ↓
Issue project credential
   ↓
Connect application
   ↓
Observe activity
```
