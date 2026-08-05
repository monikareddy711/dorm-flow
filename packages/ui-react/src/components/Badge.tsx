import React from 'react';
import { IssueStatus, IssueUrgency } from '@dormflow/shared-types';

export interface BadgeProps {
  label?: string;
  status?: IssueStatus | string;
  urgency?: IssueUrgency | string;
  variant?: 'status' | 'urgency' | 'neutral';
  children?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ label, status, urgency, variant = 'neutral', children }) => {
  let bgColor = '#e2e8f0';
  let textColor = '#334155';
  let text = label || children || '';

  if (status) {
    text = status.toString().replace('_', ' ');
    switch (status) {
      case IssueStatus.SUBMITTED:
        bgColor = '#e5e7eb';
        textColor = '#374151';
        break;
      case IssueStatus.REVIEWED:
        bgColor = '#dbeafe';
        textColor = '#1d4ed8';
        break;
      case IssueStatus.ASSIGNED:
        bgColor = '#ede9fe';
        textColor = '#6d28d9';
        break;
      case IssueStatus.IN_PROGRESS:
        bgColor = '#fef3c7';
        textColor = '#b45309';
        break;
      case IssueStatus.RESOLVED:
        bgColor = '#d1fae5';
        textColor = '#047857';
        break;
      case IssueStatus.CLOSED:
        bgColor = '#f3f4f6';
        textColor = '#4b5563';
        break;
      case IssueStatus.REJECTED:
        bgColor = '#fee2e2';
        textColor = '#b91c1c';
        break;
    }
  } else if (urgency) {
    text = urgency.toString();
    switch (urgency) {
      case IssueUrgency.LOW:
        bgColor = '#d1fae5';
        textColor = '#047857';
        break;
      case IssueUrgency.MEDIUM:
        bgColor = '#dbeafe';
        textColor = '#1d4ed8';
        break;
      case IssueUrgency.HIGH:
        bgColor = '#ffedd5';
        textColor = '#c2410c';
        break;
      case IssueUrgency.EMERGENCY:
        bgColor = '#fee2e2';
        textColor = '#b91c1c';
        break;
    }
  }

  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 9px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    backgroundColor: bgColor,
    color: textColor,
    lineHeight: '1.2',
  };

  return <span style={style}>{text}</span>;
};
