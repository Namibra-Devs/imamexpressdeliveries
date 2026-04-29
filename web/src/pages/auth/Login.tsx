import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import AppLayout from '../../components/AppLayout';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      login(response.data.user, response.data.token);
      toast.success(`Welcome back, ${response.data.user.name}!`);
      
      if (response.data.user.role === 'ADMIN') navigate('/admin');
      else if (response.data.user.role === 'RIDER') navigate('/rider');
      else navigate('/customer');
      
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const leftContent = (
    <div>
      <h2 className="text-gradient" style={{ marginBottom: '2rem', fontSize: '2rem' }}>Welcome Back</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label className="input-label" style={{ color: '#fff' }}>Email Address</label>
          <input 
            type="email" 
            className="input-field" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label className="input-label" style={{ color: '#fff' }}>Password</label>
          <input 
            type="password" 
            className="input-field" 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', borderRadius: '2rem', padding: '1rem' }} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-muted" style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Create one</Link>
      </p>
    </div>
  );

  return <AppLayout leftContent={leftContent} />;
};

export default Login;
