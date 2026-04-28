import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CreateOrder from './pages/customer/CreateOrder';
import Dashboard from './pages/admin/Dashboard';

// Pages (to be created)
const Home = () => <div className="container text-center" style={{ paddingTop: '5rem' }}>
  <h1 className="text-gradient">Premium Logistics & Delivery</h1>
  <p className="text-muted" style={{ marginTop: '1rem' }}>Fast, secure, and beautiful delivery services.</p>
  </div>;

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div className="container text-center" style={{ paddingTop: '5rem' }}>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Customer Routes */}
          <Route path="/customer/*" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CreateOrder />
            </ProtectedRoute>
          } />

          {/* Rider Routes */}
          <Route path="/rider/*" element={
            <ProtectedRoute allowedRoles={['RIDER']}>
              <div className="container text-center" style={{ paddingTop: '5rem' }}>Rider Dashboard (WIP)</div>
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
