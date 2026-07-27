import type { RecallIncident } from '../../domain/recall-schema';
import type { RecallAction } from '../../domain/recall-reducer';
import { DEFAULT_THEME } from '../../templates/shared';
import { Accordion, FormField } from '../ui';
import styles from './ThemeSection.module.css';

interface ThemeSectionProps {
  incident: RecallIncident;
  dispatch: React.Dispatch<RecallAction>;
}

const PRESETS: { name: string; accent: string; ink: string }[] = [
  { name: 'Violet', accent: '#5B45C9', ink: '#14141F' },
  { name: 'Teal', accent: '#0A6B62', ink: '#0F1A19' },
  { name: 'Navy', accent: '#1E3A5F', ink: '#101820' },
  { name: 'Crimson', accent: '#9B1C1C', ink: '#1A1010' },
];

export function ThemeSection({ incident, dispatch }: ThemeSectionProps) {
  const accent = incident.theme?.accent ?? DEFAULT_THEME.accent;
  const ink = incident.theme?.ink ?? DEFAULT_THEME.ink;

  const setTheme = (key: 'accent' | 'ink', value: string) => {
    dispatch({
      type: 'SET_FIELD',
      path: ['theme', key],
      value,
    });
  }

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    dispatch({ type: 'SET_FIELD', path: ['theme', 'accent'], value: preset.accent })
    dispatch({ type: 'SET_FIELD', path: ['theme', 'ink'], value: preset.ink })
  }

  return (
    <Accordion title="Color composer" defaultOpen>
      <div className={styles.panel}>
        <p className={styles.hint}>
          Brand colors apply across email, bulletin, and web notice.
        </p>

        <div className={styles.presets}>
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={styles.preset}
              onClick={() => applyPreset(preset)}
              aria-label={`Apply ${preset.name} palette`}
            >
              <span className={styles.swatch} style={{ background: preset.accent }} aria-hidden="true" />
              <span className={styles.swatch} style={{ background: preset.ink }} aria-hidden="true" />
              <span className={styles.presetName}>{preset.name}</span>
            </button>
          ))}
        </div>

        <FormField label="Brand accent" htmlFor="field-theme-accent">
          <div className={styles.colorRow}>
            <input
              id="field-theme-accent"
              type="color"
              className={styles.colorInput}
              value={accent}
              onChange={(e) => setTheme('accent', e.target.value)}
            />
            <input
              type="text"
              className={styles.hexInput}
              value={accent}
              spellCheck={false}
              onChange={(e) => {
                const value = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) setTheme('accent', value)
              }}
            />
          </div>
        </FormField>

        <FormField label="Ink / text" htmlFor="field-theme-ink">
          <div className={styles.colorRow}>
            <input
              id="field-theme-ink"
              type="color"
              className={styles.colorInput}
              value={ink}
              onChange={(e) => setTheme('ink', e.target.value)}
            />
            <input
              type="text"
              className={styles.hexInput}
              value={ink}
              spellCheck={false}
              onChange={(e) => {
                const value = e.target.value
                if (/^#[0-9A-Fa-f]{6}$/.test(value)) setTheme('ink', value)
              }}
            />
          </div>
        </FormField>

        <div className={styles.preview} aria-hidden="true">
          <div className={styles.previewBar} style={{ background: ink }} />
          <div className={styles.previewBody}>
            <span className={styles.previewAccent} style={{ color: accent }}>Section label</span>
            <span className={styles.previewButton} style={{ background: accent }}>Button</span>
          </div>
        </div>
      </div>
    </Accordion>
  );
}
