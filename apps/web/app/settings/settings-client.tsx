'use client'

import { ACCENT_OPTIONS, APPEARANCE_OPTIONS } from '../../lib/theme-settings'
import { useOriTheme } from '../../components/theme-provider'
import styles from './settings.module.css'

export default function SettingsClient() {
  const { preferences, updatePreferences, retrySave, saveState } = useOriTheme()

  const saveMessage = saveState === 'saving'
    ? 'Saving to your account…'
    : saveState === 'saved'
      ? 'Saved to your Ori account'
      : saveState === 'error'
        ? 'Could not save. Choose a setting again to retry.'
        : 'Changes save automatically to your Ori account.'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <p className="eyebrow">ORI PLATFORM</p>
        <h1>Settings</h1>
        <p>Make your workspace feel like yours.</p>
      </header>

      <section className={styles.section} aria-labelledby="appearance-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="appearance-title">Appearance</h2>
            <p>Choose how Ori looks across your workspace.</p>
          </div>
        </div>

        <div className={styles.appearanceOptions} role="group" aria-label="Appearance">
          {APPEARANCE_OPTIONS.map((option) => {
            const selected = preferences.appearance === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={selected ? styles.appearanceOptionActive : styles.appearanceOption}
                aria-pressed={selected}
                onClick={() => updatePreferences({ appearance: option.value })}
              >
                <span className={styles.appearancePreview + ' ' + styles[option.previewClass]}>
                  <span />
                  <span />
                  <span />
                </span>
                <span className={styles.optionText}>
                  <strong>{option.label}</strong>
                  <small>{option.description}</small>
                </span>
                <span className={styles.radioMark} aria-hidden="true" />
              </button>
            )
          })}
        </div>
        <p className={styles.note}>System follows the appearance setting on the device you are using.</p>
      </section>

      <section className={styles.section} aria-labelledby="accent-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="accent-title">Accent color</h2>
            <p>Choose the color used for message highlights, selected controls, and buttons.</p>
          </div>
        </div>

        <div className={styles.accentOptions} role="group" aria-label="Accent color">
          {ACCENT_OPTIONS.map((option) => {
            const selected = preferences.accent === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={selected ? styles.accentOptionActive : styles.accentOption}
                aria-pressed={selected}
                aria-label={option.label + (selected ? ', selected' : '')}
                onClick={() => updatePreferences({ accent: option.value })}
              >
                <span className={styles.accentSwatch} style={{ backgroundColor: option.color }} />
                <span>{option.label}</span>
                {selected && <span className={styles.accentCheck} aria-hidden="true">✓</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section className={styles.previewSection} aria-labelledby="preview-title">
        <div className={styles.previewHeading}>
          <div>
            <h2 id="preview-title">Preview</h2>
            <p>Your choices update the workspace as you make them.</p>
          </div>
          <span className={styles.previewLabel}>LIVE</span>
        </div>
        <div className={styles.previewCard}>
          <div className={styles.previewSidebar}>
            <strong>ORI</strong>
            <span className={styles.previewSelected}>＋ New chat</span>
            <span>Tools</span>
            <span>Chats</span>
            <span className={styles.previewSidebarBottom}>Settings</span>
          </div>
          <div className={styles.previewWorkspace}>
            <div className={styles.previewGreeting}>What would you like to work on?</div>
            <div className={styles.previewUserMessage}>Help me plan a project.</div>
            <div className={styles.previewComposer}>
              <span>Message Ori...</span>
              <span className={styles.previewSend}>↑</span>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.saveStatus} role="status" aria-live="polite"><span>{saveMessage}</span>{saveState === "error" && <button type="button" onClick={retrySave}>Try again</button>}</div>
    </div>
  )
}
