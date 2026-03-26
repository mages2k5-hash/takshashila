import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const Sidebar = ({ activeView, setActiveView }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['student', 'mentor', 'admin'] },
    { id: 'new-complaint', label: 'New Complaint', roles: ['student', 'mentor', 'admin'] },
    { id: 'all-complaints', label: 'All Complaints', roles: ['mentor', 'admin'] },
    { id: 'my-complaints', label: 'My Complaints', roles: ['student'] },
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div style={{
      width: '260px',
      backgroundColor: '#111827',
      color: 'white',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#F97316', fontSize: '1.5rem', fontWeight: 'bold' }}>EduResolve</h2>
        <p style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>College Portal</p>
      </div>

      <nav style={{ flex: 1 }}>
        {filteredItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeView === item.id ? '#374151' : 'transparent',
              color: activeView === item.id ? '#F97316' : '#D1D5DB',
              marginBottom: '8px',
              fontWeight: 500,
              fontSize: '0.95rem'
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid #374151', paddingTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</p>
          <p style={{ fontSize: '0.75rem', color: '#9CA3AF', textTransform: 'capitalize' }}>{user.role}</p>
        </div>
        <button 
          onClick={logout}
          className="btn btn-outline"
          style={{ width: '100%', color: '#FCA5A5', borderColor: '#7F1D1D' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
