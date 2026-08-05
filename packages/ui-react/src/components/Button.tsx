import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'secondary':
        return {
          backgroundColor: '#f1f5f9',
          color: '#0f172a',
          border: '1px solid #cbd5e1',
        };
      case 'danger':
        return {
          backgroundColor: '#dc2626',
          color: '#ffffff',
          border: '1px solid #b91c1c',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#005691',
          border: '1px solid transparent',
        };
      case 'primary':
      default:
        return {
          backgroundColor: '#005691',
          color: '#ffffff',
          border: '1px solid #004575',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.8125rem' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '1.0625rem' };
      case 'md':
      default:
        return { padding: '9px 18px', fontSize: '0.9375rem' };
    }
  };

  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    transition: 'background-color 0.15s ease, transform 0.05s ease',
    width: fullWidth ? '100%' : 'auto',
    minHeight: '44px',
    outline: 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
    ...style,
  };

  return (
    <button disabled={disabled || isLoading} style={baseStyles} {...props}>
      {isLoading ? <span>Loading...</span> : children}
    </button>
  );
};
