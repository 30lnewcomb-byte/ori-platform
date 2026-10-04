import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <main className="authPage">
      <div className="authBrand">ORI</div>
      <SignIn
        forceRedirectUrl="/chat"
        fallbackRedirectUrl="/"
        appearance={{
          variables: {
            colorPrimary: '#183A73',
            colorText: '#171815',
            colorTextSecondary: '#686B64',
            colorBackground: '#FFFFFF',
            colorInputBackground: '#F7F7F5',
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
