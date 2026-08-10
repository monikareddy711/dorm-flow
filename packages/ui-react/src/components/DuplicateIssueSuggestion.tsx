import React from 'react';
import { Issue } from '@dormflow/shared-types';
import { Button } from './Button.js';
import { Badge } from './Badge.js';

export interface DuplicateIssueSuggestionProps {
  issues: Issue[];
  onSelectExisting: (issue: Issue) => void;
  onFollowExisting: (issueId: string) => void;
}

export const DuplicateIssueSuggestion: React.FC<DuplicateIssueSuggestionProps> = ({
  issues,
  onSelectExisting,
  onFollowExisting,
}) => {
  if (issues.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Similar reported issues"
      style={{
        backgroundColor: '#fffbeb',
        border: '1px solid #fef3c7',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <h4 style={{ margin: 0, fontSize: '0.9375rem', color: '#92400e', fontWeight: 600 }}>
          Similar issues already reported in this building
        </h4>
      </div>
      <p style={{ margin: '0 0 12px 0', fontSize: '0.8125rem', color: '#b45309' }}>
        Before creating a new ticket, check if one of these matches your problem. You can subscribe to get resolution updates:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {issues.map(item => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #fde68a',
              borderRadius: '6px',
              padding: '12px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {item.roomNumber ? `Room ${item.roomNumber}` : 'Shared facility'} • {item.category}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Badge status={item.status} />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onFollowExisting(item.id)}
              >
                + This affects me too
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onSelectExisting(item)}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
