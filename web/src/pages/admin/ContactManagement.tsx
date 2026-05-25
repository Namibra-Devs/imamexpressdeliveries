import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const ContactManagement: React.FC = () => {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (error) {
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [token]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/contacts/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Message marked as read');
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Message deleted');
      setMessages(messages.filter(m => m.id !== id));
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><div className="loader"></div></div>;
  }

  return (
    <div style={{ paddingBottom: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Messages</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage incoming customer queries and contacts</p>
        </div>
      </div>

      <div className="admin-glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--bg-surface)' }}>
            <tr>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Date</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Sender</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Message</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? messages.map(msg => (
              <tr key={msg.id} style={{ borderTop: '1px solid var(--border-color)', background: msg.isRead ? 'transparent' : 'rgba(160, 32, 240, 0.05)' }}>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>{msg.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{msg.email}</div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', maxWidth: '300px' }}>
                  {msg.message}
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className={`badge ${msg.isRead ? 'badge-delivered' : 'badge-pending'}`}>
                    {msg.isRead ? 'READ' : 'NEW'}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {!msg.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>done_all</span> Mark Read
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(msg.id)}
                      className="btn"
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '2rem' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactManagement;
