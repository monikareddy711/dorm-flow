import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, interactive = false, style, ...props }) => {
  const baseStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
    cursor: interactive ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div style={baseStyle} {...props}>
      {children}
    </div>
  );
};
