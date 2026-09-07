import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User } from '@dormflow/shared-types';
import { api } from './services/api.js';
import { Navbar } from './components/Navbar.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { IssuesListPage } from './pages/IssuesListPage.js';
import { NewIssuePage } from './pages/NewIssuePage.js';
import { IssueDetailPage } from './pages/IssueDetailPage.js';
import { WebComponentDemoPage } from './pages/WebComponentDemoPage.js';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check initial user from localStorage or API
    const saved = localStorage.getItem('dormflow_user');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
    api.getCurrentUser().then(user => {
      if (user) setCurrentUser(user);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
        Loading DormFlow Aachen...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar user={currentUser} onLogout={handleLogout} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={user => setCurrentUser(user)} />}
            />
            <Route
              path="/register"
              element={<RegisterPage onRegisterSuccess={user => setCurrentUser(user)} />}
            />

            {/* Protected Routes */}
            <Route
              path="/issues"
              element={currentUser ? <IssuesListPage user={currentUser} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/issues/new"
              element={currentUser ? <NewIssuePage user={currentUser} /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/issues/:issueId"
              element={currentUser ? <IssueDetailPage user={currentUser} /> : <Navigate to="/login" replace />}
            />

            <Route path="/web-component-demo" element={<WebComponentDemoPage />} />
            <Route path="*" element={<Navigate to={currentUser ? '/issues' : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};
