import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="authPage">
      <div className="authBrand">ORI</div>
      <SignIn forceRedirectUrl="/chat" fallbackRedirectUrl="/" />
    </main>
  )
}
