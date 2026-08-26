import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@dormflow/shared-types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link
            to="/issues"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: '#005691',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1.4rem' }}>🏢</span>
            <span>DormFlow Aachen</span>
          </Link>

          {user && (
            <nav style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <Link to="/issues" style={{ fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>
                My Reports
              </Link>
              <Link to="/issues/new" style={{ fontSize: '0.9rem', color: '#005691', fontWeight: 600 }}>
                + Report Problem
              </Link>
              <Link to="/web-component-demo" style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Web Component Demo
              </Link>
            </nav>
          )}
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', fontSize: '0.8125rem' }}>
              <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.displayName}</div>
              <div style={{ color: '#64748b' }}>
                {user.buildingName ? `${user.buildingName} • Room ${user.roomNumber || 'N/A'}` : user.role}
              </div>
            </div>
            <button
              onClick={() => {
                onLogout();
                navigate('/login');
              }}
              style={{
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.8125rem',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#005691' }}>
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
