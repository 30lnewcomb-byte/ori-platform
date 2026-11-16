import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '../../components/app-shell'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in?redirect_url=/settings')
  if (user.publicMetadata?.oriOnboardingComplete !== true) redirect('/onboarding')

  return (
    <AppShell active="Settings">
      <SettingsClient />
    </AppShell>
  )
}
