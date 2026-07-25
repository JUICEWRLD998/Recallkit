import styles from './PreviewFrame.module.css';

interface PreviewFrameProps {
  html: string;
  title: string;
  width: number | '100%';
}

export function PreviewFrame({ html, title, width }: PreviewFrameProps) {
  const widthLabel = width === '100%' ? '100%' : `${width}px`;
  const iframeWidth = width === '100%' ? '100%' : `${width}px`;
  const key = `${title}-${html.length}-${html.slice(0, 64)}`;

  return (
    <div className={styles.container}>
      <div style={{ width: iframeWidth, maxWidth: '100%' }}>
        <div className={styles.topBar}>{widthLabel}</div>
        <iframe
          key={key}
          className={styles.frame}
          srcDoc={html}
          title={`Preview of ${title}`}
          sandbox="allow-same-origin"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}
