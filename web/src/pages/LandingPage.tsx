import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = (() => {
    // Fail-safe useAuth wrapper in case context is loading
    try {
      return useAuth();
    } catch {
      return { isAuthenticated: false, user: null };
    }
  })();

  const navigate = useNavigate();

  // Transit Simulator State
  const [transitStep, setTransitStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const transitPhases = [
    { title: 'Order Registered', desc: 'Package registered at Accra Hub. Generating route...', icon: 'receipt_long', color: '#a78bfa' },
    { title: 'Rider Assigned', desc: 'Rider Tijani Moro matched. Dispatched to pickup...', icon: 'pedal_bike', color: 'var(--primary)' },
    { title: 'In Transit', desc: 'En route. Express delivery package secured in thermal bag.', icon: 'local_shipping', color: '#3b82f6' },
    { title: 'Successfully Delivered', desc: 'Handed over safely. Complete in 14 mins!', icon: 'check_circle', color: '#22c55e' }
  ];

  useEffect(() => {
    let interval: any;
    if (isSimulating) {
      interval = setInterval(() => {
        setTransitStep(prev => {
          if (prev >= 3) {
            setIsSimulating(false);
            return 3;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const startSimulation = () => {
    setTransitStep(0);
    setIsSimulating(true);
  };

  const handleCtaClick = () => {
    if (isAuthenticated && user) {
      if (user.role === 'CUSTOMER') navigate('/customer');
      else if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'RIDER') navigate('/rider');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#1e0e1a', 
      color: '#fff', 
      fontFamily: "'Outfit', sans-serif", 
      overflowX: 'hidden',
      position: 'relative'
    }}>
      {/* Background Neon Orbs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '50vw',
        height: '50vw',
        background: 'radial-gradient(circle, rgba(160, 32, 240, 0.08) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(160, 32, 240, 0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Top Navbar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        background: 'rgba(30, 14, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', boxShadow: '0 4px 12px rgba(160, 32, 240, 0.3)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1.5rem' }}>local_shipping</span>
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }} className="text-gradient">Imam Express</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {isAuthenticated ? (
            <button 
              onClick={handleCtaClick}
              className="btn btn-primary"
              style={{ borderRadius: '2rem', padding: '0.6rem 1.5rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Go to Dashboard <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>arrow_forward</span>
            </button>
          ) : (
            <>
              <span onClick={() => navigate('/login')} style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }} className="hover-light">Sign In</span>
              <button 
                onClick={() => navigate('/register')}
                className="btn btn-primary"
                style={{ borderRadius: '2rem', padding: '0.6rem 1.5rem', fontSize: '0.875rem' }}
              >
                Register Now
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '4rem',
        padding: '6rem 5% 4rem 5%',
        maxWidth: '1300px',
        margin: '0 auto',
        zIndex: 2,
        position: 'relative',
        alignItems: 'center'
      }} className="mobile-column-layout">
        <div>
          <span style={{
            background: 'rgba(160,32,240,0.1)',
            border: '1px solid rgba(160,32,240,0.2)',
            color: 'var(--primary-light)',
            padding: '0.5rem 1.25rem',
            borderRadius: '2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '1.5rem'
          }}>
            ⚡ Ultra-Fast Delivery in Accra
          </span>
          
          <h1 style={{ 
            fontSize: '3.75rem', 
            fontWeight: 800, 
            lineHeight: 1.1, 
            marginBottom: '1.5rem',
            letterSpacing: '-1.5px'
          }}>
            Fast, Reliable & <br />
            <span className="text-gradient">Premium Logistics</span>
          </h1>
          
          <p style={{ 
            fontSize: '1.15rem', 
            color: 'var(--text-muted)', 
            lineHeight: 1.6, 
            marginBottom: '2.5rem',
            maxWidth: '540px'
          }}>
            Imam Express Deliveries offers hyper-local package shipping across town instantly. Request a rider, watch your live transit, and complete secure payments in seconds.
          </p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }} className="mobile-wrap">
            <button 
              onClick={handleCtaClick}
              className="btn btn-primary"
              style={{ padding: '1rem 2rem', borderRadius: '2rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 6px 20px rgba(160, 32, 240, 0.4)' }}
            >
              Book a Delivery Now
              <span className="material-symbols-outlined">bolt</span>
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('simulator');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ 
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.05)', 
                color: '#fff', 
                padding: '1rem 2rem', 
                borderRadius: '2rem', 
                fontSize: '1rem', 
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="hover-card"
            >
              Try Live Simulator
            </button>
          </div>
        </div>

        {/* Live Simulator Card */}
        <div id="simulator" style={{ zIndex: 3 }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '2rem',
            padding: '2.5rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Visual Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Imam Live-Tracker</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Real-time transit simulator</p>
              </div>
              <button 
                onClick={startSimulation}
                disabled={isSimulating}
                style={{
                  background: isSimulating ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '2rem',
                  padding: '0.5rem 1.25rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: isSimulating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: isSimulating ? 'none' : '0 4px 10px rgba(160, 32, 240, 0.3)'
                }}
              >
                {isSimulating ? 'Simulating...' : 'Run Demo'}
                <span className="material-symbols-outlined" style={{ fontSize: '0.95rem' }}>play_arrow</span>
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '2.5rem', padding: '0 0.5rem' }}>
              {/* Connector line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                height: '4px',
                background: 'rgba(255,255,255,0.05)',
                zIndex: 0
              }} />
              {/* Filled line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                width: `${(transitStep / 3) * 90}%`,
                height: '4px',
                background: 'var(--primary)',
                transition: 'width 0.5s ease',
                zIndex: 0
              }} />

              {transitPhases.map((phase, idx) => (
                <div key={idx} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: idx <= transitStep ? 'var(--primary)' : '#2b1426',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: idx <= transitStep ? '3px solid #1e0e1a' : '3px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.4s ease'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>{phase.icon}</span>
                  </div>
                  <span style={{ fontSize: '0.65rem', fontWeight: idx <= transitStep ? 700 : 500, color: idx <= transitStep ? '#fff' : 'var(--text-muted)', marginTop: '0.5rem' }}>
                    {phase.title.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Details Bubble */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1.25rem',
              padding: '1.5rem',
              textAlign: 'center',
              minHeight: '110px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem', color: transitPhases[transitStep].color, marginBottom: '0.5rem' }}>
                {transitPhases[transitStep].icon}
              </span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                {transitPhases[transitStep].title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0', lineHeight: 1.4, maxWidth: '280px' }}>
                {transitPhases[transitStep].desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section style={{
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.03)',
        padding: '4rem 5%',
        zIndex: 2,
        position: 'relative'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '3rem',
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center'
        }} className="mobile-column-layout">
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0 }} className="text-gradient">15,000+</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Completed Deliveries</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0 }} className="text-gradient">99.8%</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>On-Time Rate</p>
          </div>
          <div>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, margin: 0 }} className="text-gradient">24 Mins</h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Average Shipping Time</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section style={{
        padding: '6rem 5%',
        maxWidth: '1200px',
        margin: '0 auto',
        zIndex: 2,
        position: 'relative'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }} className="text-gradient">Our Specialized Logistics</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Premium service categories tailored to every speed and cargo size.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2rem'
        }} className="mobile-column-layout">
          {/* Card 1 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '2rem',
            padding: '2.5rem',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} className="hover-card">
            <div style={{
              background: 'rgba(160, 32, 240, 0.1)',
              color: 'var(--primary)',
              width: '64px',
              height: '64px',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>bolt</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Express Instant</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Immediate document and critical package courier. A dedicated rider navigates straight to your recipient without stops.
            </p>
          </div>

          {/* Card 2 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '2rem',
            padding: '2.5rem',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} className="hover-card">
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              color: '#3b82f6',
              width: '64px',
              height: '64px',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>inventory_2</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Standard Courier</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Fast and secure package delivery under 2 hours. Perfectly suited for retail orders, lunch packs, and general shipping.
            </p>
          </div>

          {/* Card 3 */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '2rem',
            padding: '2.5rem',
            textAlign: 'center',
            transition: 'transform 0.3s ease'
          }} className="hover-card">
            <div style={{
              background: 'rgba(34, 197, 94, 0.1)',
              color: '#22c55e',
              width: '64px',
              height: '64px',
              borderRadius: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '2rem' }}>local_shipping</span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Bulk Cargo</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Heavy cargo and bulk shipping options. Certified logistics vehicles matching specific box dimensions and weights.
            </p>
          </div>
        </div>
      </section>

      {/* Conversion Banner */}
      <section style={{
        padding: '4rem 5% 8rem 5%',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
        zIndex: 2,
        position: 'relative'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(160, 32, 240, 0.15) 0%, rgba(30, 14, 26, 0.9) 100%)',
          border: '1px solid rgba(160, 32, 240, 0.2)',
          borderRadius: '2.5rem',
          padding: '4rem 3rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to experience next-gen shipping?</h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', maxWidth: '580px', margin: '0 auto 2.5rem auto' }}>
            Join thousands of individuals and vendors managing express deliveries across town in real-time.
          </p>
          <button 
            onClick={handleCtaClick}
            className="btn btn-primary"
            style={{ padding: '1rem 2.5rem', borderRadius: '2rem', fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '0 auto', boxShadow: '0 6px 20px rgba(160, 32, 240, 0.4)' }}
          >
            Create Your Account
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.03)',
        padding: '3rem 5%',
        textAlign: 'center',
        background: '#120710'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }} className="mobile-column-layout">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>local_shipping</span>
            <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Imam Express</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
            © {new Date().getFullYear()} Imam Express Deliveries Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
