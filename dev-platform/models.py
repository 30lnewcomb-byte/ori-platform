from __future__ import annotations

from datetime import datetime, timezone
from enum import StrEnum
from uuid import uuid4

from pydantic import BaseModel, Field


class ProjectStatus(StrEnum):
    ACTIVE = "active"
    ARCHIVED = "archived"


class Project(BaseModel):
    project_id: str = Field(default_factory=lambda: f"proj-{uuid4().hex[:12]}")
    name: str
    description: str = ""
    status: ProjectStatus = ProjectStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ApiKeyStatus(StrEnum):
    ACTIVE = "active"
    REVOKED = "revoked"


class ApiKeyMetadata(BaseModel):
    key_id: str = Field(default_factory=lambda: f"key-{uuid4().hex[:12]}")
    name: str
    status: ApiKeyStatus = ApiKeyStatus.ACTIVE
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_used_at: datetime | None = None


class ToolRegistration(BaseModel):
    tool_id: str = Field(default_factory=lambda: f"tool-{uuid4().hex[:12]}")
    name: str
    description: str = ""
    enabled: bool = True


class PlatformEvent(BaseModel):
    event_id: str = Field(default_factory=lambda: f"pev-{uuid4().hex[:12]}")
    type: str
    project_id: str | None = None
    detail: dict[str, object] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
