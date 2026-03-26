import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const NewComplaintForm = ({ onSubmit, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      createdBy: user.id,
      creatorName: user.name,
      assignedTo: user.role === 'student' ? 'u2' : 'u3' // Student -> Mentor, Mentor -> Admin
    });
    setFormData({ title: '', description: '', category: 'General' });
    onSuccess();
  };

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#F97316' }}>Create New Complaint</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
          <input 
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="E.g., Library Fan Not Working"
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option>General</option>
            <option>Infrastructure</option>
            <option>IT Services</option>
            <option>Hostel</option>
            <option>Canteen</option>
          </select>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Description</label>
          <textarea 
            required
            rows="5"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Please provide details about your complaint..."
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Submit Complaint
        </button>
      </form>
    </div>
  );
};
