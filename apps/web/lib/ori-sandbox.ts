import 'server-only'

import { runInOriVm, writeToOriVm, readFromOriVm, getOriVmStatus } from './ori-vm'

export async function getOriSandbox() {
  return getOriVmStatus()
}

export async function runInOriSandbox(command: string, args: string[] = []) {
  return runInOriVm(command, args)
}

export async function writeOriWorkspaceFile(path: string, content: string) {
  return writeToOriVm(path, content)
}

export async function readOriWorkspaceFile(path: string) {
  return readFromOriVm(path)
}

export const oriSandboxInfo = {
  provider: 'Render',
  userVisible: false,
  purpose: 'Private execution and workspace environment for Ori.',
}
