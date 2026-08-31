import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IssueCard, Button, Spinner, Alert } from '@dormflow/ui-react';
import { api } from '../services/api.js';
import { Issue, User, IssueCategory, IssueStatus } from '@dormflow/shared-types';

interface IssuesListPageProps {
  user: User;
}

export const IssuesListPage: React.FC<IssuesListPageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'my' | 'all'>('all');

  const loadIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getIssues({
        buildingId: activeTab === 'all' ? (user.buildingId || undefined) : undefined,
        category: filterCategory || undefined,
        status: filterStatus || undefined,
        search: searchTerm || undefined,
        mineOnly: activeTab === 'my',
        userId: user.id,
      });
      setIssues(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, [filterCategory, filterStatus, activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadIssues();
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.75rem', color: '#005691' }}>
            Maintenance Issues
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9375rem' }}>
            {user.buildingName ? `Showing reports for ${user.buildingName}` : 'All Aachen Dormitories'}
          </p>
        </div>
        <Button onClick={() => navigate('/issues/new')} size="md">
          + Report Maintenance Issue
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontSize: '0.9375rem',
            fontWeight: activeTab === 'all' ? 700 : 500,
            color: activeTab === 'all' ? '#005691' : '#64748b',
            borderBottom: activeTab === 'all' ? '2px solid #005691' : 'none',
            cursor: 'pointer',
          }}
        >
          Building Open Issues
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('my')}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px 16px',
            fontSize: '0.9375rem',
            fontWeight: activeTab === 'my' ? 700 : 500,
            color: activeTab === 'my' ? '#005691' : '#64748b',
            borderBottom: activeTab === 'my' ? '2px solid #005691' : 'none',
            cursor: 'pointer',
          }}
        >
          My Submitted Reports
        </button>
      </div>

      {/* Filters Bar */}
      <form onSubmit={handleSearchSubmit} className="filters-bar">
        <input
          type="text"
          placeholder="Search by keywords or room..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
          }}
        />
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
          }}
        >
          <option value="">All Categories</option>
          {Object.values(IssueCategory).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '0.875rem',
          }}
        >
          <option value="">All Statuses</option>
          {Object.values(IssueStatus).map(s => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </form>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spinner size="lg" label="Loading reported issues..." />
        </div>
      ) : issues.length === 0 ? (
        <div className="empty-state">
          <h3>No maintenance reports found</h3>
          <p>Everything in this dormitory appears to be in working condition!</p>
          <Button variant="secondary" onClick={() => navigate('/issues/new')} style={{ marginTop: '12px' }}>
            Submit a New Report
          </Button>
        </div>
      ) : (
        <div>
          {issues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={selected => navigate(`/issues/${selected.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
