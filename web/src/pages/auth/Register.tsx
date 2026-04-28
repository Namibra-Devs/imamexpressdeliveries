import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="text-center text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem' }}>Create Account</h2>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Phone (Optional)</label>
              <input type="text" className="input-field" name="phone" placeholder="+1234567890" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" className="input-field" name="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" name="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Account Type</label>
            <select className="input-field" name="role" value={formData.role} onChange={handleChange} style={{ appearance: 'none' }}>
              <option value="CUSTOMER" style={{ color: 'black' }}>Customer</option>
              <option value="RIDER" style={{ color: 'black' }}>Rider</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
