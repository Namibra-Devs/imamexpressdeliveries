import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

interface Order {
  id: string;
  pickupLocation: string;
  dropoffLocation: string;
  receiverName: string;
  receiverContact: string;
  status: string;
  price: number;
}

const AssignedDeliveries: React.FC = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Security PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rider/my-deliveries', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.orders);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch assigned deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string, pin?: string) => {
    setUpdating(true);
    setPinError('');
    try {
      await axios.patch(`http://localhost:5000/api/rider/orders/${orderId}/status`, 
        { status: newStatus, pin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh list
      fetchOrders();
      if (newStatus === 'DELIVERED') {
        setIsPinModalOpen(false);
        setPinInput('');
      }
    } catch (err: any) {
      if (newStatus === 'DELIVERED') {
        setPinError(err.response?.data?.message || 'Invalid PIN');
      } else {
        alert(err.response?.data?.message || 'Failed to update status');
      }
    } finally {
      setUpdating(false);
    }
  };

  const openMaps = (location: string) => {
    const query = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const initiateDelivery = (orderId: string) => {
    setActiveOrderId(orderId);
    setIsPinModalOpen(true);
    setPinInput('');
    setPinError('');
  };

  const confirmDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderId) return;
    if (pinInput.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }
    handleStatusUpdate(activeOrderId, 'DELIVERED', pinInput);
  };

  if (loading) return <div className="text-center" style={{ paddingTop: '5rem' }}>Loading Deliveries...</div>;

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>My Deliveries</h2>
      
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {orders.length === 0 && !error ? (
        <div className="glass-card text-center" style={{ padding: '3rem' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>inventory_2</span>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No assigned deliveries</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You will see new orders here when they are assigned to you.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ 
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '1.25rem',
              padding: '1.25rem',
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.25rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1rem' }}>
                <span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1.1rem' }}>GH₵{order.price.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Pickup */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#eab308', marginTop: '0.1rem' }}>trip_origin</span>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Pickup Location</p>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.pickupLocation}</p>
                    </div>
                  </div>
                  <button onClick={() => openMaps(order.pickupLocation)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '0.5rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>navigation</span>
                  </button>
                </div>
                
                <div style={{ borderLeft: '2px dashed rgba(255,255,255,0.1)', height: '15px', marginLeft: '11px', marginTop: '-0.5rem', marginBottom: '-0.5rem' }}></div>

                {/* Dropoff */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <span className="material-symbols-outlined" style={{ color: '#22c55e', marginTop: '0.1rem' }}>location_on</span>
                    <div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.1rem' }}>Drop-off Location</p>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{order.dropoffLocation}</p>
                    </div>
                  </div>
                  <button onClick={() => openMaps(order.dropoffLocation)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '0.5rem', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', cursor: 'pointer' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1.1rem' }}>navigation</span>
                  </button>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: '0.75rem' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Receiver Contact</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontWeight: 500, fontSize: '0.9rem' }}>{order.receiverName}</p>
                  <a href={`tel:${order.receiverContact}`} style={{ color: 'var(--primary-light)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>call</span>
                    {order.receiverContact}
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginTop: '0.5rem' }}>
                {order.status === 'ASSIGNED' && (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 700, opacity: updating ? 0.7 : 1 }}
                    onClick={() => handleStatusUpdate(order.id, 'PICKED_UP')}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'I have picked up the package'}
                  </button>
                )}
                {order.status === 'PICKED_UP' && (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '0.95rem', fontWeight: 700, background: 'linear-gradient(135deg, #10b981, #059669)', border: 'none', opacity: updating ? 0.7 : 1 }}
                    onClick={() => initiateDelivery(order.id)}
                    disabled={updating}
                  >
                    Enter Delivery PIN
                  </button>
                )}
                {order.status === 'DELIVERED' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'rgba(34, 197, 94, 0.1)', padding: '0.75rem', borderRadius: '1rem', color: '#22c55e', fontWeight: 700 }}>
                    <span className="material-symbols-outlined">verified</span>
                    Delivery Complete
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PIN Verification Modal */}
      <AnimatePresence>
        {isPinModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(5px)',
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: '#16161c',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1.5rem',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setIsPinModalOpen(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '3rem', color: 'var(--primary-light)', marginBottom: '0.5rem' }}>lock</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Verify Delivery</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ask the receiver for their 4-digit order PIN to complete this delivery.</p>
              </div>

              <form onSubmit={confirmDelivery}>
                <input 
                  type="text" 
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  style={{
                    width: '100%',
                    background: '#23232a',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    padding: '1rem',
                    fontSize: '1.5rem',
                    letterSpacing: '0.5rem',
                    textAlign: 'center',
                    color: '#fff',
                    outline: 'none',
                    marginBottom: '1rem',
                    fontWeight: 800
                  }}
                  autoFocus
                />
                
                {pinError && (
                  <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', fontWeight: 600 }}>{pinError}</p>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1rem', borderRadius: '1rem', fontSize: '1rem', fontWeight: 700 }}
                  disabled={updating || pinInput.length !== 4}
                >
                  {updating ? 'Verifying...' : 'Confirm Delivery'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AssignedDeliveries;
