import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <main className="authPage">
      <div className="authBrand">ORI</div>
      <SignUp
        forceRedirectUrl="/onboarding"
        signInForceRedirectUrl="/chat"
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: '#183A73',
            colorForeground: '#171815',
            colorMutedForeground: '#686B64',
            colorBackground: '#FFFFFF',
            colorInput: '#F7F7F5',
            borderRadius: '12px',
          },
          elements: {
            cardBoxShadow: '0 16px 40px rgba(0, 0, 0, 0.08)',
          },
        }}
      />
    </main>
  )
}
