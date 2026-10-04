import { SignIn } from '@clerk/nextjs'

function getSafeRedirect(value: string | string[] | undefined) {
  const redirect = Array.isArray(value) ? value[0] : value
  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('//')) {
    return '/chat'
  }
  return redirect
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string | string[] }>
}) {
  const { redirect_url } = await searchParams
  const redirectUrl = getSafeRedirect(redirect_url)

  return (
    <main className="authPage">
      <div className="authBrand">ORI</div>
      <SignIn
        forceRedirectUrl={redirectUrl}
        signUpForceRedirectUrl="/onboarding"
        fallbackRedirectUrl="/chat"
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
