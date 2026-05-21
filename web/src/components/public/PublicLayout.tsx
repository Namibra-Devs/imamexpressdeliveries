import React from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';

const PublicLayout: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-base)',
      color: 'var(--text-main)', 
      fontFamily: "'Outfit', sans-serif", 
      position: 'relative',
      transition: 'background 0.3s, color 0.3s'
    }}>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
