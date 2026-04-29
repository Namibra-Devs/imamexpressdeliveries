import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../../components/AppLayout';

const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();

  const leftContent = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem' }}>
      <div style={{ 
        width: '100px', 
        height: '100px', 
        background: 'rgba(160, 32, 240, 0.1)', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '2rem',
        border: '1px solid var(--primary)'
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '4rem', color: 'var(--primary)' }}>mark_email_read</span>
      </div>

      <h2 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Congratulations!</h2>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Your account has been successfully created.</p>
      <p className="text-muted" style={{ marginBottom: '2.5rem', maxWidth: '320px' }}>
        We've sent a verification link to your email address. Please check your inbox and verify your email to activate your account.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
        <button 
          className="btn btn-primary" 
          style={{ padding: '1rem', borderRadius: '2rem' }}
          onClick={() => navigate('/login')}
        >
          Go to Sign In
        </button>
        <button 
          className="btn btn-secondary" 
          style={{ padding: '1rem', borderRadius: '2rem', background: 'transparent' }}
          onClick={() => window.location.reload()}
        >
          Resend Email
        </button>
      </div>
    </div>
  );

  return <AppLayout leftContent={leftContent} />;
};

export default RegisterSuccess;
