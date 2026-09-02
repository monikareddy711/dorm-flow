import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  Select,
  Alert,
  Card,
  DuplicateIssueSuggestion,
} from '@dormflow/ui-react';
import { api } from '../services/api.js';
import {
  User,
  Building,
  Issue,
  IssueCategory,
  IssueUrgency,
  LocationType,
} from '@dormflow/shared-types';

interface NewIssuePageProps {
  user: User;
}

export const NewIssuePage: React.FC<NewIssuePageProps> = ({ user }) => {
  const navigate = useNavigate();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [buildingId, setBuildingId] = useState(user.buildingId || '');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IssueCategory>(IssueCategory.HEATING);
  const [urgency, setUrgency] = useState<IssueUrgency>(IssueUrgency.MEDIUM);
  const [locationType, setLocationType] = useState<LocationType>(LocationType.PRIVATE_ROOM);
  const [roomNumber, setRoomNumber] = useState(user.roomNumber || '');

  const [existingBuildingIssues, setExistingBuildingIssues] = useState<Issue[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getBuildings().then(data => {
      setBuildings(data);
      if (!buildingId && data.length > 0) {
        setBuildingId(data[0].id);
      }
    }).catch(console.error);
  }, []);

  // Duplicate detection query whenever building or category changes
  useEffect(() => {
    if (!buildingId) return;
    api.getIssues({ buildingId, category }).then(res => {
      // Find open issues in the same building and category
      const openMatches = res.data.filter(
        i => i.status !== 'RESOLVED' && i.status !== 'CLOSED' && i.status !== 'REJECTED',
      );
      setExistingBuildingIssues(openMatches);
    }).catch(console.error);
  }, [buildingId, category]);

  const handleFollowExisting = async (issueId: string) => {
    try {
      await api.followIssue(issueId);
      navigate(`/issues/${issueId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe to issue');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !buildingId) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await api.createIssue({
        title: title.trim(),
        description: description.trim(),
        category,
        urgency,
        locationType,
        buildingId,
        roomNumber: roomNumber.trim() || undefined,
      });

      navigate(`/issues/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '680px' }}>
      <div style={{ marginBottom: '20px' }}>
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
        <h1 style={{ margin: '8px 0 4px 0', fontSize: '1.75rem', color: '#005691' }}>
          Report a Maintenance Issue
        </h1>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
          Submit private room repairs or shared facility problems to Aachen dorm management.
        </p>
      </div>

      {urgency === IssueUrgency.EMERGENCY && (
        <Alert variant="danger" title="⚠️ Emergency Notice">
          DormFlow is not an emergency hotline. In case of active fire, gas leak, severe flood, or medical emergency, please call <strong>112</strong> immediately.
        </Alert>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Duplicate detection widget */}
      <DuplicateIssueSuggestion
        issues={existingBuildingIssues}
        onSelectExisting={issue => navigate(`/issues/${issue.id}`)}
        onFollowExisting={handleFollowExisting}
      />

      <Card>
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Issue Title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            placeholder="e.g. Radiator leaking water on the floor"
            helperText="Summarize the core problem concisely"
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Select
              label="Building"
              value={buildingId}
              onChange={e => setBuildingId(e.target.value)}
              options={buildings.map(b => ({ value: b.id, label: b.name }))}
              required
            />

            <Select
              label="Location Type"
              value={locationType}
              onChange={e => setLocationType(e.target.value as LocationType)}
              options={Object.values(LocationType).map(lt => ({
                value: lt,
                label: lt.replace('_', ' '),
              }))}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <Select
              label="Category"
              value={category}
              onChange={e => setCategory(e.target.value as IssueCategory)}
              options={Object.values(IssueCategory).map(c => ({ value: c, label: c }))}
              required
            />

            <Select
              label="Urgency"
              value={urgency}
              onChange={e => setUrgency(e.target.value as IssueUrgency)}
              options={Object.values(IssueUrgency).map(u => ({ value: u, label: u }))}
              required
            />
          </div>

          <TextInput
            label="Room / Location Details"
            type="text"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            placeholder="e.g. Room 412 or 2nd floor shared kitchen"
            helperText="Optional for shared areas (kitchen, laundry room, hallway)"
          />

          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
              Detailed Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe when the issue started, exact location, error codes, and symptoms..."
              style={{
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9375rem',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button type="button" variant="secondary" onClick={() => navigate('/issues')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              Submit Maintenance Report
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
