"""High-level sandbox orchestration for OriOS Lite."""

from __future__ import annotations

from dataclasses import dataclass

from .provider import SandboxProvider, SandboxResult, SandboxWorkspace


@dataclass
class SandboxManager:
    provider: SandboxProvider

    def create_project_workspace(self, project_id: str) -> SandboxWorkspace:
        return self.provider.create_workspace(project_id)

    def run(self, workspace_id: str, command: list[str]) -> SandboxResult:
        # Authorization, command policy, resource limits, and audit logging
        # belong here before delegating to the runtime provider.
        return self.provider.run_task(workspace_id, command)

    def read(self, workspace_id: str, path: str) -> str:
        return self.provider.read_file(workspace_id, path)

    def write(self, workspace_id: str, path: str, content: str) -> None:
        self.provider.write_file(workspace_id, path, content)

    def snapshot(self, workspace_id: str) -> str:
        return self.provider.create_snapshot(workspace_id)
