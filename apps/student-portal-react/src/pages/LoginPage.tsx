import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, TextInput, Alert, Card } from '@dormflow/ui-react';
import { api } from '../services/api.js';
import { User } from '@dormflow/shared-types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('lina@rwth-aachen.de');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const auth = await api.login({ email, password });
      onLoginSuccess(auth.user);
      navigate('/issues');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutofill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
  };

  return (
    <div className="container" style={{ maxWidth: '440px', marginTop: '40px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 8px 0', color: '#005691' }}>Resident Sign In</h2>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            Aachen Student Housing Maintenance Portal
          </p>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextInput
            label="Email Address"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="student@rwth-aachen.de"
          />

          <TextInput
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <Button type="submit" fullWidth isLoading={loading} style={{ marginTop: '8px' }}>
            Sign In
          </Button>
        </form>

        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '8px', fontWeight: 600 }}>
            Quick Demo Accounts:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleAutofill('lina@rwth-aachen.de')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              Lina (Resident • Kastanienweg)
            </button>
            <button
              type="button"
              onClick={() => handleAutofill('noor@rwth-aachen.de')}
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              Noor (Resident Rep • Eckertweg)
            </button>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Register here
          </Link>
        </div>
      </Card>
    </div>
  );
};
