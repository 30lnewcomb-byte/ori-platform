import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import OnboardingClient from './onboarding-client'
import styles from './onboarding.module.css'

export default async function OnboardingPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in?redirect_url=/onboarding')

  if (user.publicMetadata?.oriOnboardingComplete === true) {
    redirect('/chat')
  }

  return (
    <main className={styles.page}>
      <div className={styles.brand}>ORI</div>
      <OnboardingClient firstName={user.firstName ?? 'there'} />
    </main>
  )
}
