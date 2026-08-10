import React from 'react';
import { Issue } from '@dormflow/shared-types';
import { Badge } from './Badge.js';
import { Card } from './Card.js';

export interface IssueCardProps {
  issue: Issue;
  onClick?: (issue: Issue) => void;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue, onClick }) => {
  const formattedDate = new Date(issue.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={() => onClick?.(issue)}
      style={{ marginBottom: '12px' }}
      role="article"
      aria-label={`Issue report: ${issue.title}`}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '1.0625rem', color: '#0f172a', fontWeight: 600 }}>
          {issue.title}
        </h4>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <Badge urgency={issue.urgency} />
          <Badge status={issue.status} />
        </div>
      </div>

      <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {issue.description}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
        <div>
          <span>{issue.building?.name || 'Aachen Dorm'}</span>
          {issue.roomNumber && <span> • Room {issue.roomNumber}</span>}
          <span> • {issue.category}</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {issue.commentsCount !== undefined && <span>💬 {issue.commentsCount}</span>}
          {issue.followersCount !== undefined && <span>👥 {issue.followersCount}</span>}
          <span>{formattedDate}</span>
        </div>
      </div>
    </Card>
  );
};
