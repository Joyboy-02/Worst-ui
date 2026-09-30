import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChaosProvider } from './context/ChaosContext';
import { HostileNavbar } from './components/HostileNavbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdvisoryForm } from './pages/AdvisoryForm';
import { AdvisoryResults } from './pages/AdvisoryResults';
import { History } from './pages/History';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ChaosProvider>
        <HashRouter>
          {/* Regulatory watermark overlay across entire application */}
          <div className="nature-overlay" />

          {/* Hostile Dynamic Navigation Bar */}
          <HostileNavbar />

          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/advisory/new" element={<AdvisoryForm />} />
              <Route path="/advisory/results" element={<AdvisoryResults />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </HashRouter>
      </ChaosProvider>
    </AuthProvider>
  );
};

export default App;
