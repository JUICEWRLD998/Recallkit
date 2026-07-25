import { useEffect, useState } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { PreviewFrame } from './PreviewFrame';
import styles from './PreviewStage.module.css';

type ActiveOutput = 'email' | 'document' | 'page';
type WidthOption = { label: string; ariaLabel: string; icon: React.ReactNode; value: number | '100%' };

interface PreviewStageProps {
  html: string;
  title: string;
  activeOutput: ActiveOutput;
}

function getWidthOptions(activeOutput: ActiveOutput): WidthOption[] {
  if (activeOutput === 'email') {
    return [
      { label: 'desktop', ariaLabel: 'Desktop width', icon: <Monitor size={20} />, value: 680 },
      { label: 'mobile', ariaLabel: 'Mobile width', icon: <Smartphone size={16} />, value: 375 },
    ];
  }

  if (activeOutput === 'document') {
    return [
      { label: 'desktop', ariaLabel: 'Desktop width', icon: <Monitor size={20} />, value: 860 },
    ];
  }

  return [
    { label: 'desktop', ariaLabel: 'Desktop width', icon: <Monitor size={20} />, value: '100%' },
    { label: 'tablet', ariaLabel: 'Tablet width', icon: <Tablet size={18} />, value: 768 },
    { label: 'mobile', ariaLabel: 'Mobile width', icon: <Smartphone size={16} />, value: 375 },
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
    <div>
      <div className={styles.widthControls} role="group" aria-label="Preview width">
        {options.map((option, index) => (
          <button
            key={option.label}
            type="button"
            className={`${styles.widthButton}${index === activeIndex ? ` ${styles.active}` : ''}`}
            aria-label={option.ariaLabel}
            aria-pressed={index === activeIndex}
            onClick={() => setActiveIndex(index)}
          >
            {option.icon}
          </button>
        ))}
      </div>
      <PreviewFrame html={html} title={title} width={currentWidth} />
    </div>
  );
}
