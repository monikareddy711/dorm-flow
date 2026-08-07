import React from 'react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children }) => {
  const getStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46' };
      case 'warning':
        return { bg: '#fffbeb', border: '#fde68a', text: '#92400e' };
      case 'danger':
        return { bg: '#fef2f2', border: '#fecaca', text: '#991b1b' };
      case 'info':
      default:
        return { bg: '#eff6ff', border: '#bfdbfe', text: '#1e40af' };
    }
  };

  const { bg, border, text } = getStyles();

  return (
    <div
      role="alert"
      style={{
        backgroundColor: bg,
        border: `1px solid ${border}`,
        borderRadius: '8px',
        padding: '14px 16px',
        color: text,
        marginBottom: '16px',
      }}
    >
      {title && <h5 style={{ margin: '0 0 6px 0', fontWeight: 600, fontSize: '0.9375rem' }}>{title}</h5>}
      <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
};
