import React from 'react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const TextInput: React.FC<TextInputProps> = ({ label, id, error, helperText, style, required, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={inputId} style={{ marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        style={{
          padding: '10px 12px',
          borderRadius: '6px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          fontSize: '0.9375rem',
          outline: 'none',
          minHeight: '44px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          transition: 'border-color 0.15s ease',
          ...style,
        }}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} role="alert" style={{ marginTop: '4px', fontSize: '0.8125rem', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ marginTop: '4px', fontSize: '0.8125rem', color: '#64748b' }}>
          {helperText}
        </span>
      )}
    </div>
  );
};
