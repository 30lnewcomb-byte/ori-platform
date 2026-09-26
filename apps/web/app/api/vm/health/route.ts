import { NextResponse } from 'next/server'
import { getOriVmStatus, oriVmInfo } from '../../../../lib/ori-vm'

export async function GET() {
  if (!oriVmInfo.configured) {
    return NextResponse.json({
      ok: false,
      configured: false,
      provider: 'Render',
      service: 'ori-vm-runtime',
      status: 'not_configured',
    }, { status: 503 })
  }

  try {
    const vm = await getOriVmStatus()
    return NextResponse.json({
      ok: vm.status === 'online',
      configured: true,
      provider: 'Render',
      service: vm.service,
      version: vm.version,
      workspace: vm.workspace,
      execution: vm.execution,
      commands: vm.commands,
      status: vm.status,
    })
  } catch (error) {
    return NextResponse.json({
      ok: false,
      configured: true,
      provider: 'Render',
      service: 'ori-vm-runtime',
      status: 'unreachable',
      error: error instanceof Error ? error.message : 'VM runtime request failed.',
    }, { status: 502 })
  }
}
