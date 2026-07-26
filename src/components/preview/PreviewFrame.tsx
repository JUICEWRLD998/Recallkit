import styles from './PreviewFrame.module.css';

type PreviewVariant = 'email' | 'document' | 'page';

interface PreviewFrameProps {
  html: string;
  title: string;
  width: number | '100%';
  allowScripts?: boolean;
  variant?: PreviewVariant;
}

const variantClass: Record<PreviewVariant, string> = {
  email: 'sheetEmail',
  document: 'sheetDocument',
  page: 'sheetPage',
};

export function PreviewFrame({
  html,
  title,
  width,
  allowScripts = false,
  variant = 'email',
}: PreviewFrameProps) {
  const iframeWidth = width === '100%' ? '100%' : `${width}px`;
  const key = `${title}-${html.length}-${html.slice(0, 64)}`;
  const fullBleed = width === '100%';

  return (
    <div className={`${styles.container}${fullBleed ? ` ${styles.containerFull}` : ''}`}>
      <div
        className={`${styles.sheet} ${styles[variantClass[variant]]}${fullBleed ? ` ${styles.sheetFull}` : ''}`}
        style={{ width: iframeWidth, maxWidth: '100%' }}
      >
        <iframe
          key={key}
          className={styles.frame}
          srcDoc={html}
          title={`Preview of ${title}`}
          sandbox={allowScripts ? 'allow-scripts allow-popups' : 'allow-same-origin'}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
