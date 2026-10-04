'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './onboarding.module.css'

const choices = [
  { id: 'chat', title: 'Chat and explore', description: 'Questions, ideas, research, and everyday work.' },
  { id: 'coding', title: 'Code and build', description: 'Programming, debugging, and developer projects.' },
  { id: '3d', title: '3D and CAD', description: 'Design work, modeling, and technical projects.' },
  { id: 'everything', title: 'A bit of everything', description: 'Keep Ori flexible and use whatever you need.' },
]

export default function OnboardingClient({ firstName }: { firstName: string }) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [useCase, setUseCase] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const finish = async () => {
    setSaving(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ useCase }),
      })

      if (!response.ok) throw new Error('Could not save your Ori setup.')
      router.replace('/chat')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your Ori setup.')
      setSaving(false)
    }
  }

  return (
    <section className={styles.card} aria-labelledby="onboarding-title">
      <div className={styles.progress}>
        <span className={step === 1 ? styles.progressActive : ''} />
        <span className={step === 2 ? styles.progressActive : ''} />
      </div>

      {step === 1 ? (
        <div className={styles.step}>
          <span className={styles.kicker}>WELCOME TO ORI</span>
          <h1 id="onboarding-title">Nice to meet you, {firstName}.</h1>
          <p>Let&apos;s take a moment to set up your workspace. You can change how you work with Ori later.</p>

          <div className={styles.choiceBlock}>
            <span className={styles.question}>What will you use Ori for most?</span>
            <div className={styles.choices}>
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  type="button"
                  className={useCase === choice.id ? styles.choiceActive : styles.choice}
                  onClick={() => setUseCase(choice.id)}
                >
                  <strong>{choice.title}</strong>
                  <span>{choice.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primary}
              disabled={!useCase}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.step}>
          <span className={styles.kicker}>YOUR ORI WORKSPACE</span>
          <h1>You&apos;re ready.</h1>
          <p>
            Your account is set up. Ori can start with conversation and bring in the right tools
            when your work calls for them.
          </p>

          <div className={styles.summary}>
            <span>Starting with</span>
            <strong>{choices.find((choice) => choice.id === useCase)?.title}</strong>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <div className={styles.actions}>
            <button type="button" className={styles.primary} disabled={saving} onClick={finish}>
              {saving ? 'Setting up…' : 'Enter Ori'}
            </button>
            <button type="button" className={styles.back} disabled={saving} onClick={() => setStep(1)}>
              Back
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
