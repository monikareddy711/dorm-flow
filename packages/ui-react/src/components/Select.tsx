import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  id,
  error,
  helperText,
  required,
  style,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
      <label htmlFor={selectId} style={{ marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      <select
        id={selectId}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${selectId}-error` : undefined}
        style={{
          padding: '10px 12px',
          borderRadius: '6px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          fontSize: '0.9375rem',
          outline: 'none',
          minHeight: '44px',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          cursor: 'pointer',
          ...style,
        }}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${selectId}-error`} role="alert" style={{ marginTop: '4px', fontSize: '0.8125rem', color: '#ef4444' }}>
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
