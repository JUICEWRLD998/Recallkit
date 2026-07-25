import { forwardRef } from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`${styles.input}${error ? ` ${styles.error}` : ''}${className ? ` ${className}` : ''}`}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
