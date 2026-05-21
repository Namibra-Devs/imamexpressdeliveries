import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useLoadScript } from '@react-google-maps/api';
import AuthLayout from '../../components/AuthLayout';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [locationName, setLocationName] = useState<string>('Detecting location...');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  useEffect(() => {
    if (navigator.geolocation && isLoaded) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const geocoder = new google.maps.Geocoder();
          const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
          geocoder.geocode({ location: userLocation }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
              const addressComponents = results[0].address_components;
              const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || 
                           addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
              setLocationName(city || 'Unknown Location');
            }
          });
        },
        () => {
          setLocationName('Accra, Ghana');
        }
      );
    }
  }, [isLoaded]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await axios.get(`http://localhost:5000/api/auth/verify-email?token=${token}`);
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (error: any) {
        console.error('Verification error:', error);
        if (error.response?.status === 400 && error.response?.data?.message?.includes('expired')) {
          setStatus('expired');
        } else {
          setStatus('error');
        }
      }
    };

    verifyToken();
  }, [token]);

  return (
    <AuthLayout locationName={locationName}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', width: '100%' }}>
        {status === 'loading' && (
          <>
            <div className="loader" style={{ marginBottom: '2rem' }}></div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Verifying email...</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Please wait while we confirm your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #10b981' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#10b981' }}>verified</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Email Verified!</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Your email has been successfully verified. You can now access all features.</p>
            <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '2rem', padding: '0.8rem 2rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => navigate('/login')}>
              Go to Sign In
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #ef4444' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#ef4444' }}>error</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Verification Failed</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: 1.5 }}>The verification link is invalid or already used. Please try registering again or contact support.</p>
            <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '2rem', padding: '0.8rem 2rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => navigate('/register')}>
              Back to Registration
            </button>
          </>
        )}

        {status === 'expired' && (
          <>
            <div style={{ width: '80px', height: '80px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', border: '1px solid #f59e0b' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: '#f59e0b' }}>history</span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Link Expired</h1>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: 1.5 }}>This verification link has expired because it is older than 15 minutes. Please request a new link.</p>
            <button style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '2rem', padding: '0.8rem 2rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }} onClick={() => navigate('/resend-verification')}>
              Resend Verification Link
            </button>
          </>
        )}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
