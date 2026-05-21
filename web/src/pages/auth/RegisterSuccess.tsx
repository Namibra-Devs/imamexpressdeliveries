import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import AuthLayout from '../../components/AuthLayout';

const RegisterSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const registeredEmail = location.state?.email || 'your email';
  const [locationName, setLocationName] = useState<string>('Detecting location...');

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

  return (
    <AuthLayout locationName={locationName}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', width: '100%' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          background: 'rgba(160, 32, 240, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginBottom: '2rem',
          border: '1px solid var(--primary)'
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary)' }}>mark_email_read</span>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 500, margin: '0 0 1rem 0', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>Congratulations!</h1>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Your account has been successfully created.</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '400px', lineHeight: 1.5 }}>
          We've sent a verification link to <strong style={{ color: 'var(--primary)' }}>{registeredEmail}</strong>. Please check your inbox and verify your email to activate your account.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            style={{ background: 'transparent', color: 'var(--primary)', border: 'none', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => navigate('/resend-verification')}
          >
            Resend Email
          </button>
          <button 
            style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '2rem', padding: '0.6rem 1.5rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => navigate('/login')}
          >
            Go to Sign In
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterSuccess;
