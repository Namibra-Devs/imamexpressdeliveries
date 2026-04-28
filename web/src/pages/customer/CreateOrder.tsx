import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const CreateOrder: React.FC = () => {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    receiverName: '',
    receiverContact: '',
    packageDescription: ''
  });
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // In a real app with Google Maps API, we would estimate price here based on coordinates.
    // For now, we rely on the backend dummy logic upon submission, or we can just mock an estimate.
    if (formData.pickupLocation && formData.dropoffLocation) {
      setPriceEstimate(Math.floor(Math.random() * 15) + 10); // Mock estimate between 10 and 25
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setFormData({
        pickupLocation: '', dropoffLocation: '', receiverName: '', receiverContact: '', packageDescription: ''
      });
      setPriceEstimate(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 className="text-gradient" style={{ marginBottom: '1.5rem', fontSize: '1.75rem' }}>Create Delivery Request</h2>
        
        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6EE7B7', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
            Delivery request submitted successfully! A rider will be assigned shortly.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Pickup Location</label>
            <input type="text" className="input-field" name="pickupLocation" placeholder="Enter pickup address" value={formData.pickupLocation} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Drop-off Location</label>
            <input type="text" className="input-field" name="dropoffLocation" placeholder="Enter delivery address" value={formData.dropoffLocation} onChange={handleChange} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Receiver's Name</label>
              <input type="text" className="input-field" name="receiverName" placeholder="Jane Doe" value={formData.receiverName} onChange={handleChange} required />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Receiver's Contact</label>
              <input type="text" className="input-field" name="receiverContact" placeholder="+1234567890" value={formData.receiverContact} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Package Description (Optional)</label>
            <textarea 
              className="input-field" 
              name="packageDescription" 
              placeholder="E.g., Fragile electronics, Document folder" 
              value={formData.packageDescription} 
              onChange={handleChange}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>

          {priceEstimate && (
            <div style={{ background: 'rgba(79, 70, 229, 0.1)', border: '1px solid rgba(79, 70, 229, 0.3)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-muted">Estimated Cost:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-light)' }}>${priceEstimate.toFixed(2)}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Delivery Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
