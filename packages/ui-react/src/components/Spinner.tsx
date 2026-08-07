import React from 'react';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', label = 'Loading...' }) => {
  const dim = size === 'sm' ? 18 : size === 'lg' ? 36 : 24;

  return (
    <div
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
      }}
    >
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        style={{
          animation: 'dormflow-spin 0.8s linear infinite',
        }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="#e2e8f0"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="#005691"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{label}</span>
      <style>{`
        @keyframes dormflow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
