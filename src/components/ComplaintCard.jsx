import React from 'react';

export const ComplaintCard = ({ complaint, onUpdate, user, onAction }) => {
  const statusColors = {
    processing: 'badge-processing',
    done: 'badge-done',
    cancelled: 'badge-cancelled'
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{complaint.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: '8px' }}>
            ID: {complaint.id} • {new Date(complaint.createdAt).toLocaleDateString()} • By {complaint.creatorName}
          </p>
        </div>
        <span className={`badge ${statusColors[complaint.status]}`}>
          {complaint.status}
        </span>
      </div>
      
      <p style={{ fontSize: '0.95rem', color: '#374151', margin: '12px 0' }}>{complaint.description}</p>
      
      {complaint.resolution && (
        <div style={{ 
          background: '#FFF7ED', 
          borderLeft: '4px solid #F97316', 
          padding: '12px', 
          marginTop: '16px',
          borderRadius: '4px'
        }}>
          <p style={{ fontSize: '0.8rem', color: '#9A3412', fontWeight: 'bold', marginBottom: '4px' }}>Resolution:</p>
          <p style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>{complaint.resolution}</p>
        </div>
      )}

      <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
        {/* Mentor Actions */}
        {user.role === 'mentor' && complaint.status === 'processing' && (
          <>
            <button 
              onClick={() => onUpdate(complaint.id, { status: 'cancelled' })}
              className="btn btn-outline" style={{ fontSize: '0.8rem', color: '#EF4444' }}
            >
              Cancel Complaint
            </button>
            <button 
              onClick={() => onUpdate(complaint.id, { assignedTo: 'u3' })}
              className="btn btn-primary" style={{ fontSize: '0.8rem' }}
            >
              Escalate to Admin
            </button>
          </>
        )}

        {/* Admin Actions */}
        {user.role === 'admin' && complaint.status === 'processing' && (
          <>
            <button 
              onClick={() => onAction('resolve', complaint)}
              className="btn btn-primary" style={{ fontSize: '0.8rem' }}
            >
              Mark as Done
            </button>
            <button 
              onClick={() => onAction('contact-mentor', complaint)}
              className="btn btn-outline" style={{ fontSize: '0.8rem' }}
            >
              Contact Mentor
            </button>
          </>
        )}
      </div>
    </div>
  );
};
