import { cloneElement, isValidElement } from 'react';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  /** Id of the labelled form control. Use `groupId` instead for composite controls. */
  htmlFor?: string;
  /**
   * Renders the label as a span with this id and wraps the control in a
   * role="group" element labelled by it. Use for composite controls
   * (segmented controls, lists) that have no single labellable input.
   */
  groupId?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, htmlFor, groupId, error, required, children }: FormFieldProps) {
  const errorId = error ? `${groupId ?? htmlFor}-error` : undefined;

  const control =
    !groupId && errorId && isValidElement(children)
      ? cloneElement(children as React.ReactElement<Record<string, unknown>>, {
          error: true,
          'aria-invalid': true,
          'aria-describedby': errorId,
        })
      : children;

  const labelContent = (
    <>
      {label}
      {required && <span className={styles.asterisk}>*</span>}
    </>
  );

  return (
    <div className={styles.field}>
      {groupId ? (
        <span className={styles.label} id={groupId}>
          {labelContent}
        </span>
      ) : (
        <label className={styles.label} htmlFor={htmlFor}>
          {labelContent}
        </label>
      )}
      {groupId ? (
        <div role="group" aria-labelledby={groupId} aria-describedby={errorId}>
          {control}
        </div>
      ) : (
        control
      )}
      {error && (
        <span role="alert" id={errorId} className={styles.error}>
          {error}
        </span>
      )}
    </div>
  );
}
