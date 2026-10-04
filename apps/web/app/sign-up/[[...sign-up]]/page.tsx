import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="authPage">
      <div className="authBrand">ORI</div>
      <SignUp forceRedirectUrl="/chat" fallbackRedirectUrl="/" />
    </main>
  )
}
