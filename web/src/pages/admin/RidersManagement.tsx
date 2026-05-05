import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Rider {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  rider: { id: string } | null;
}

const QuickActionMenu = ({ rider, onView }: { rider: Rider, onView: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        className="nav-item-hover"
      >
        <span className="material-symbols-outlined">more_vert</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 90 }} onClick={(e) => { e.stopPropagation(); setOpen(false); }}></div>
          <div style={{ position: 'absolute', right: 0, top: '100%', background: '#1e0e1a', border: '1px solid rgba(160,32,240,0.2)', borderRadius: '0.5rem', padding: '0.5rem', zIndex: 100, minWidth: '150px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            <button 
              onClick={(e) => { e.stopPropagation(); setOpen(false); onView(); }}
              style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '0.5rem', color: '#fff', cursor: 'pointer', borderRadius: '0.25rem', fontSize: '0.85rem' }}
              className="nav-item-hover"
            >
              View Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const RidersManagement: React.FC = () => {
  const { token } = useAuth();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modals & Panels
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardData, setOnboardData] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const [ridersRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/riders', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRiders(ridersRes.data.riders);
      setOrders(ordersRes.data.orders);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.error('Failed to load riders');
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        ...onboardData,
        role: 'RIDER'
      });
      toast.success('Rider onboarded successfully! A verification email has been sent to them.');
      setShowOnboardModal(false);
      setOnboardData({ name: '', email: '', phone: '', password: '' });
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to onboard rider');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><div className="loader"></div></div>;

  // Calculate active riders (those who have an order with status ASSIGNED or PICKED_UP)
  const activeRidersCount = new Set(
    orders
      .filter(o => (o.status === 'ASSIGNED' || o.status === 'PICKED_UP') && o.rider)
      .map(o => o.rider!.id)
  ).size;

  return (
    <div style={{ paddingBottom: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>Riders Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Human resources oversight for logistics personnel</p>
        </div>
        <button 
          onClick={() => setShowOnboardModal(true)}
          className="btn btn-primary" 
          style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 1.5rem', fontSize: '0.9rem' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>person_add</span>
          Onboard Rider
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="admin-glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(160, 32, 240, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(160, 32, 240, 0.3)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '2rem' }}>two_wheeler</span>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Total Fleet Size</p>
            <h3 style={{ fontSize: '2rem', color: '#fff', fontWeight: 800 }}>{riders.length}</h3>
          </div>
        </div>

        <div className="admin-glass-card" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <span className="material-symbols-outlined" style={{ color: '#10b981', fontSize: '2rem' }}>check_circle</span>
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Active Riders</p>
            <h3 style={{ fontSize: '2rem', color: '#fff', fontWeight: 800 }}>{activeRidersCount}</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flex: 1, overflow: 'hidden' }}>
        
        {/* Main Data Grid */}
        <div className="admin-glass-card" style={{ flex: selectedRider ? 2 : 1, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'flex 0.3s ease' }}>
          <div style={{ overflowY: 'auto' }} className="custom-scrollbar">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'rgba(255,255,255,0.02)', position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  <th style={{ padding: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Rider Personnel</th>
                  <th style={{ padding: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Contact</th>
                  <th style={{ padding: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Onboarded On</th>
                  <th style={{ padding: '1rem 2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map(rider => {
                  const isActive = orders.some(o => (o.status === 'ASSIGNED' || o.status === 'PICKED_UP') && o.rider?.id === rider.id);
                  return (
                    <tr 
                      key={rider.id} 
                      onClick={() => setSelectedRider(rider)}
                      className="data-table-row" 
                      style={{ 
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        background: selectedRider?.id === rider.id ? 'rgba(160, 32, 240, 0.1)' : 'transparent',
                        borderLeft: selectedRider?.id === rider.id ? '3px solid var(--primary)' : '3px solid transparent'
                      }}
                    >
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                              {rider.name.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: '50%', background: isActive ? '#10b981' : '#6b7280', border: '2px solid var(--bg-darker)' }}></div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#fff' }}>{rider.name}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {rider.id.split('-')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.9rem', color: '#ccc' }}>{rider.email}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rider.phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', fontSize: '0.9rem', color: '#ccc' }}>
                        {new Date(rider.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1.25rem 2rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          <QuickActionMenu 
                            rider={rider} 
                            onView={() => setSelectedRider(rider)} 
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {riders.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No riders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Side Panel */}
        {selectedRider && (
          <div className="admin-glass-card" style={{ flex: 1, padding: 0, display: 'flex', flexDirection: 'column', animation: 'fade-in-right 0.3s ease', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Rider Profile</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>#{selectedRider.id}</p>
              </div>
              <button 
                onClick={() => setSelectedRider(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="custom-scrollbar">
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '2rem', marginBottom: '1rem' }}>
                {selectedRider.name.charAt(0).toUpperCase()}
              </div>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>{selectedRider.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>{selectedRider.email}</p>

              <div style={{ width: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem' }}>Contact Info</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Phone</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>{selectedRider.phone || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</span>
                  <span style={{ fontSize: '0.85rem', color: orders.some(o => (o.status === 'ASSIGNED' || o.status === 'PICKED_UP') && o.rider?.id === selectedRider.id) ? '#10b981' : '#ccc' }}>
                    {orders.some(o => (o.status === 'ASSIGNED' || o.status === 'PICKED_UP') && o.rider?.id === selectedRider.id) ? 'In Transit' : 'Available'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Onboarded</span>
                  <span style={{ fontSize: '0.85rem', color: '#fff' }}>{new Date(selectedRider.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div style={{ width: '100%', marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                 <button style={{ flex: 1, padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} className="nav-item-hover">
                   <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>message</span> Message
                 </button>
                 <button style={{ flex: 1, padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} className="nav-item-hover">
                   <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>block</span> Suspend
                 </button>
              </div>

            </div>
          </div>
        )}
      </div>

      {/* Onboard Modal */}
      {showOnboardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '400px', animation: 'fade-in 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>Onboard Rider</h2>
              <button onClick={() => setShowOnboardModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleOnboardSubmit}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" required className="input-field" value={onboardData.name} onChange={e => setOnboardData({...onboardData, name: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input type="email" required className="input-field" value={onboardData.email} onChange={e => setOnboardData({...onboardData, email: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input type="tel" required className="input-field" value={onboardData.phone} onChange={e => setOnboardData({...onboardData, phone: e.target.value})} />
              </div>
              <div className="input-group">
                <label className="input-label">Temporary Password</label>
                <input type="password" required className="input-field" value={onboardData.password} onChange={e => setOnboardData({...onboardData, password: e.target.value})} />
              </div>
              
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                {submitting ? 'Creating Profile...' : 'Create Rider Profile'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RidersManagement;
