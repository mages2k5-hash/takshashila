import { useState, useEffect } from 'react';
import initialData from '../data/db.json';

export const useDatabase = () => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('college_complaints_db');
    return saved ? JSON.parse(saved) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('college_complaints_db', JSON.stringify(data));
  }, [data]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: 'c' + (data.complaints.length + 1),
      createdAt: new Date().toISOString(),
      status: 'processing',
      logs: [{ at: new Date().toISOString(), by: complaint.createdBy, action: 'created' }]
    };
    setData(prev => ({
      ...prev,
      complaints: [newComplaint, ...prev.complaints]
    }));
    return newComplaint;
  };

  const updateComplaint = (id, updates) => {
    setData(prev => ({
      ...prev,
      complaints: prev.complaints.map(c => 
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  };

  const deleteComplaint = (id) => {
    setData(prev => ({
      ...prev,
      complaints: prev.complaints.filter(c => c.id !== id)
    }));
  };

  return {
    users: data.users,
    complaints: data.complaints,
    addComplaint,
    updateComplaint,
    deleteComplaint,
    refresh: () => setData(initialData)
  };
};
