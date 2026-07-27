import { useEffect, useState } from 'react';
import { PreviewFrame } from './PreviewFrame';
import styles from './PreviewStage.module.css';

type ActiveOutput = 'email' | 'document' | 'page';

interface WidthOption {
  label: string;
  value: number | '100%';
}

interface PreviewStageProps {
  html: string;
  title: string;
  activeOutput: ActiveOutput;
}

function getWidthOptions(activeOutput: ActiveOutput): WidthOption[] {
  if (activeOutput === 'email') {
    return [
      { label: 'Desktop', value: 680 },
      { label: 'Mobile', value: 375 },
    ];
  }

  if (activeOutput === 'document') {
    return [
      { label: 'A4', value: 794 },
      { label: 'Letter', value: 816 },
    ];
  }

  return [
    { label: 'Full', value: '100%' },
    { label: 'Tablet', value: 768 },
    { label: 'Mobile', value: 375 },
  ];
}

export function PreviewStage({ html, title, activeOutput }: PreviewStageProps) {
  const options = getWidthOptions(activeOutput);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeOutput]);

  const currentWidth = options[activeIndex]?.value ?? options[0].value;

  return (
    <div className={styles.stage}>
      <div className={styles.toolbar}>
        <span className={styles.stageTitle}>{title}</span>
        <div className={styles.widthControls} role="group" aria-label="Preview width">
          {options.map((option, index) => (
            <button
              key={option.label}
              type="button"
              className={`${styles.widthButton}${index === activeIndex ? ` ${styles.active}` : ''}`}
              aria-pressed={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <PreviewFrame
        html={html}
        title={title}
        width={currentWidth}
        allowScripts={activeOutput === 'page'}
        variant={activeOutput}
      />
    </div>
  );
}
