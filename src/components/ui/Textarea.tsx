import { forwardRef } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`${styles.textarea}${error ? ` ${styles.error}` : ''}${className ? ` ${className}` : ''}`}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
