import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextInput, Select, Alert, Card } from '@dormflow/ui-react';
import { api } from '../services/api.js';
import { User, Building, UserRole } from '@dormflow/shared-types';

interface RegisterPageProps {
  onRegisterSuccess: (user: User) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegisterSuccess }) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buildingId, setBuildingId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getBuildings().then(data => {
      setBuildings(data);
      if (data.length > 0) setBuildingId(data[0].id);
    }).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = await api.register({
        displayName,
        email,
        password,
        buildingId,
        roomNumber,
        role: UserRole.RESIDENT,
      });
      onRegisterSuccess(auth.user);
      navigate('/issues');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '30px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#005691' }}>Create Resident Account</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            Register to report and track issues in your Aachen student residence
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Full Name"
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            required
            placeholder="e.g. Lina Al-Mansoor"
          />

          <TextInput
            label="RWTH or FH Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="e.g. student@rwth-aachen.de"
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            helperText="Minimum 8 characters with letters and numbers"
          />

          <Select
            label="Dormitory Building"
            value={buildingId}
            onChange={e => setBuildingId(e.target.value)}
            options={buildings.map(b => ({ value: b.id, label: `${b.name} (${b.address})` }))}
            required
          />

          <TextInput
            label="Room Number"
            type="text"
            value={roomNumber}
            onChange={e => setRoomNumber(e.target.value)}
            placeholder="e.g. 412"
            helperText="Optional if you primarily report shared building issues"
          />

          <Button type="submit" fullWidth isLoading={loading} style={{ marginTop: '8px' }}>
            Create Account
          </Button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
};
