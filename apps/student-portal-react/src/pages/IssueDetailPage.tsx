import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Spinner,
  Alert,
} from '@dormflow/ui-react';
import { api } from '../services/api.js';
import {
  Issue,
  User,
  Comment,
  IssueStatusHistory,
} from '@dormflow/shared-types';

interface IssueDetailPageProps {
  user: User;
}

export const IssueDetailPage: React.FC<IssueDetailPageProps> = ({ user }) => {
  const { issueId } = useParams<{ issueId: string }>();
  const navigate = useNavigate();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [history, setHistory] = useState<IssueStatusHistory[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!issueId) return;
    setLoading(true);
    try {
      const [issueData, historyData, commentsData] = await Promise.all([
        api.getIssue(issueId),
        api.getIssueHistory(issueId),
        api.getComments(issueId),
      ]);
      setIssue(issueData);
      setHistory(historyData);
      setComments(commentsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [issueId]);

  const handleToggleFollow = async () => {
    if (!issue) return;
    try {
      if (issue.isFollowedByMe) {
        await api.unfollowIssue(issue.id);
        setIssue({ ...issue, isFollowedByMe: false, followersCount: (issue.followersCount || 1) - 1 });
      } else {
        await api.followIssue(issue.id);
        setIssue({ ...issue, isFollowedByMe: true, followersCount: (issue.followersCount || 0) + 1 });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating subscription');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const added = await api.addComment(issue.id, newComment.trim());
      setComments([...comments, added]);
      setNewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spinner size="lg" label="Loading ticket details..." />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="container">
        <Alert variant="danger">{error || 'Ticket not found'}</Alert>
        <Button onClick={() => navigate('/issues')}>Return to Reports</Button>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/issues')}
          style={{
            background: 'none',
            border: 'none',
            color: '#005691',
            cursor: 'pointer',
            padding: 0,
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          ← Back to Reports
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Main Details Card */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>TICKET #{issue.id}</span>
              <h1 style={{ margin: '4px 0 8px 0', fontSize: '1.5rem', color: '#0f172a' }}>{issue.title}</h1>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Badge urgency={issue.urgency} />
              <Badge status={issue.status} />
              <Button
                size="sm"
                variant={issue.isFollowedByMe ? 'secondary' : 'primary'}
                onClick={handleToggleFollow}
              >
                {issue.isFollowedByMe ? '✓ Following updates' : '+ Follow this issue'}
              </Button>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.875rem', color: '#64748b', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
            <div><strong>Building:</strong> {issue.building?.name || 'Aachen Dorm'}</div>
            {issue.roomNumber && <div><strong>Room:</strong> {issue.roomNumber}</div>}
            <div><strong>Category:</strong> {issue.category}</div>
            <div><strong>Location:</strong> {issue.locationType.replace('_', ' ')}</div>
            {issue.assignedToUser && (
              <div><strong>Assigned To:</strong> {issue.assignedToUser.displayName}</div>
            )}
          </div>

          <h3 style={{ fontSize: '1rem', color: '#334155', marginBottom: '8px' }}>Description</h3>
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
            {issue.description}
          </p>
        </Card>

        {/* Status History Timeline (US-02 requirement) */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: '0 0 16px 0' }}>
            Resolution Progress Timeline
          </h3>
          <div className="timeline" role="region" aria-label="Status history timeline">
            {history.map(item => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: '#0f172a' }}>
                    Status changed to <Badge status={item.newStatus} />
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                {item.note && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#475569' }}>
                    {item.note}
                  </p>
                )}
                {item.changedByName && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Updated by {item.changedByName}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Discussion / Comments */}
        <Card>
          <h3 style={{ fontSize: '1.125rem', color: '#0f172a', margin: '0 0 16px 0' }}>
            Comments & Updates ({comments.length})
          </h3>

          <div style={{ marginBottom: '20px' }}>
            {comments.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.875rem', fontStyle: 'italic' }}>
                No messages yet. Send a message to dormitory management below.
              </p>
            ) : (
              comments.map(c => (
                <div key={c.id} className={`comment-bubble ${c.visibility === 'INTERNAL' ? 'internal' : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8125rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>
                      {c.authorName} {c.authorRole && `(${c.authorRole})`}
                    </span>
                    <span style={{ color: '#64748b' }}>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5 }}>
                    {c.content}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddComment}>
            <textarea
              rows={3}
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Ask a question or provide an update for management..."
              required
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                marginBottom: '10px',
              }}
            />
            <div style={{ textAlign: 'right' }}>
              <Button type="submit" size="sm" isLoading={submittingComment}>
                Post Message
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
