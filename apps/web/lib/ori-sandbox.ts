import 'server-only'

import { Sandbox } from '@vercel/sandbox'

const SANDBOX_NAME = 'ori-private-world'
const SNAPSHOT_EXPIRATION = 7 * 24 * 60 * 60 * 1000
const WORKDIR = '/vercel/sandbox/ori-world'

const ALLOWED_COMMANDS = new Set([
  'cat',
  'cp',
  'echo',
  'find',
  'git',
  'grep',
  'ls',
  'node',
  'npm',
  'pwd',
  'python',
  'python3',
  'sed',
  'test',
  'tsc',
])

function validateCommand(command: string, args: string[]) {
  if (!ALLOWED_COMMANDS.has(command)) {
    throw new Error(`Sandbox command not allowed: ${command}`)
  }

  // Keep the first implementation deliberately conservative. Ori can inspect,
  // test, build and work with files, but cannot launch shells or alter the host.
  const joined = args.join(' ')
  if (/[;&|`$<>]/.test(joined)) {
    throw new Error('Shell metacharacters are not allowed in sandbox arguments.')
  }
}

export async function getOriSandbox() {
  return Sandbox.get({ name: SANDBOX_NAME }).catch(() =>
    Sandbox.create({
      name: SANDBOX_NAME,
      persistent: true,
      snapshotExpiration: SNAPSHOT_EXPIRATION,
      timeout: 5 * 60 * 1000,
    }),
  )
}

export async function runInOriSandbox(command: string, args: string[] = []) {
  validateCommand(command, args)
  const sandbox = await getOriSandbox()
  const result = await sandbox.runCommand(command, args, { cwd: WORKDIR })
  return {
    exitCode: result.exitCode,
    stdout: await result.stdout(),
    stderr: await result.stderr(),
  }
}

export async function writeOriWorkspaceFile(path: string, content: string) {
  if (!path || path.includes('..') || !path.startsWith('/')) {
    throw new Error('Workspace paths must be absolute and cannot escape the Ori World directory.')
  }

  const relative = path.replace(/^\/+/, '')
  const sandbox = await getOriSandbox()
  await sandbox.writeFiles([
    {
      path: `${WORKDIR}/${relative}`,
      content: Buffer.from(content, 'utf-8'),
    },
  ])
}

export const oriSandboxInfo = {
  name: SANDBOX_NAME,
  workdir: WORKDIR,
  persistent: true,
  userVisible: false,
  purpose: 'Private execution and workspace environment for Ori.',
}
