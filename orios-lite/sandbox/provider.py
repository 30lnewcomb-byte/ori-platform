"""Provider-neutral contract for OriOS Lite sandbox backends.

The first deployment target is Render, but higher layers should depend only on
this interface so the runtime can be replaced later.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class SandboxWorkspace:
    workspace_id: str
    project_id: str
    status: str = "ready"
    metadata: dict[str, str] = field(default_factory=dict)


@dataclass
class SandboxResult:
    task_id: str
    status: str
    stdout: str = ""
    stderr: str = ""
    exit_code: int | None = None


class SandboxProvider(Protocol):
    """Minimal contract implemented by every sandbox runtime provider."""

    def create_workspace(self, project_id: str) -> SandboxWorkspace: ...

    def get_workspace(self, workspace_id: str) -> SandboxWorkspace: ...

    def run_task(self, workspace_id: str, command: list[str]) -> SandboxResult: ...

    def read_file(self, workspace_id: str, path: str) -> str: ...

    def write_file(self, workspace_id: str, path: str, content: str) -> None: ...

    def get_logs(self, workspace_id: str) -> list[str]: ...

    def stop_task(self, workspace_id: str, task_id: str) -> None: ...

    def create_snapshot(self, workspace_id: str) -> str: ...

    def restore_snapshot(self, workspace_id: str, snapshot_id: str) -> None: ...
