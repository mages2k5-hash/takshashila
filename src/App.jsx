import React, { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { ComplaintCard } from './components/ComplaintCard'
import { NewComplaintForm } from './components/NewComplaintForm'
import { useAuth, AuthProvider } from './hooks/useAuth'
import { useDatabase } from './hooks/useDatabase'

const ResolutionForm = ({ complaint, onResolve, onBack }) => {
  const [resolution, setResolution] = useState('');
  return (
    <div className="card animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '16px', padding: '4px 12px' }}>← Back</button>
      <h2 style={{ color: '#F97316', marginBottom: '8px' }}>Resolve Complaint</h2>
      <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px' }}>ID: {complaint.id} - {complaint.title}</p>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '8px', fontWeight: 'bold' }}>Resolution Description</label>
        <textarea 
          required
          rows="6"
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Enter a short description of the resolution..."
        />
      </div>
      <button 
        className="btn btn-primary" 
        style={{ width: '100%' }}
        onClick={() => onResolve(complaint.id, { resolution, status: 'done' })}
      >
        Submit Resolution
      </button>
    </div>
  );
};

const MentorDetails = ({ mentorId, users, onBack }) => {
  const mentor = users.find(u => u.id === mentorId);
  return (
    <div className="card animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '20px', alignSelf: 'start' }}>← Back</button>
      <div style={{ 
        width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F97316', 
        color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '2rem', fontWeight: 'bold', margin: '0 auto 16px'
      }}>
        {mentor?.name[0]}
      </div>
      <h2 style={{ marginBottom: '4px' }}>{mentor?.name}</h2>
      <p style={{ color: '#F97316', fontWeight: '600', marginBottom: '16px' }}>Senior Mentor</p>
      
      <div style={{ textAlign: 'left', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '8px' }}>Email: <span style={{ color: '#111827' }}>{mentor?.email}</span></p>
        <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '8px' }}>Department: <span style={{ color: '#111827' }}>Student Welfare</span></p>
        <p style={{ fontSize: '0.9rem', color: '#6B7280' }}>Contact: <span style={{ color: '#111827' }}>+91 98765 43210</span></p>
      </div>
    </div>
  );
};

const Dashboard = ({ activeView, setActiveView, complaints, addComplaint, updateComplaint, users }) => {
  const { user } = useAuth();
  const [viewState, setViewState] = useState({ view: 'list', data: null });
  
  const filteredComplaints = complaints.filter(c => {
    // Admin restriction: Only see escalated complaints (assigned to u3)
    if (user.role === 'admin') {
      if (c.assignedTo !== 'u3') return false;
    }

    if (activeView === 'my-complaints') return c.createdBy === user.id;
    if (activeView === 'all-complaints') return true;
    if (activeView === 'dashboard') {
      if (user.role === 'student') return c.createdBy === user.id;
      if (user.role === 'mentor') return c.assignedTo === user.id || c.status === 'processing';
      if (user.role === 'admin') return c.assignedTo === 'u3';
    }
    return true;
  });

  const handleAction = (type, data) => {
    setViewState({ view: type, data });
  };

  const handleBack = () => {
    setViewState({ view: 'list', data: null });
  };

  if (viewState.view === 'resolve') {
    return <ResolutionForm 
      complaint={viewState.data} 
      onResolve={(id, updates) => {
        updateComplaint(id, updates);
        handleBack();
      }} 
      onBack={handleBack} 
    />;
  }

  if (viewState.view === 'contact-mentor') {
    return <MentorDetails mentorId={viewState.data.assignedTo || 'u2'} users={users} onBack={handleBack} />;
  }

  return (
    <div className="main-content animate-fade-in">
      <header style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
            {activeView === 'dashboard' ? `Welcome, ${user.name}` : 
             activeView === 'new-complaint' ? 'Report an Issue' : 
             activeView === 'my-complaints' ? 'My Reported Issues' : 'All College Complaints'}
          </h1>
          <p style={{ color: '#6B7280' }}>
            {user.role === 'admin' ? 'Reviewing escalated complaints from mentors.' : 
             activeView === 'dashboard' ? 'Here is a quick overview of relevant complaints.' : 'Track and manage complaints across the campus.'}
          </p>
        </div>
        {activeView !== 'new-complaint' && (
          <button className="btn btn-primary" onClick={() => setActiveView('new-complaint')}>
            + New Complaint
          </button>
        )}
      </header>

      {activeView === 'new-complaint' ? (
        <NewComplaintForm 
          onSubmit={addComplaint} 
          onSuccess={() => setActiveView('dashboard')} 
        />
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {filteredComplaints.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px', color: '#6B7280' }}>
              <p>No complaints found for this view.</p>
              {user.role === 'admin' && <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Waiting for mentors to escalate issues.</p>}
            </div>
          ) : (
            filteredComplaints.map(c => (
              <ComplaintCard 
                key={c.id} 
                complaint={c} 
                user={user} 
                onUpdate={updateComplaint} 
                onAction={handleAction}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

const LoginScreen = () => {
  const { login } = useAuth();
  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)' 
    }}>
      <div className="card animate-fade-in" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#F97316', marginBottom: '8px' }}>EduResolve</h2>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>Complaint Management Platform</p>
        <p style={{ marginBottom: '16px', fontWeight: 'bold' }}>Choose your login role:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button className="btn btn-outline" onClick={() => login('student')} style={{ justifyContent: 'center' }}>
            Login as Student
          </button>
          <button className="btn btn-outline" onClick={() => login('mentor')} style={{ justifyContent: 'center' }}>
            Login as Mentor
          </button>
          <button className="btn btn-outline" onClick={() => login('admin')} style={{ justifyContent: 'center' }}>
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  )
}

const AppShell = () => {
  const { user } = useAuth();
  const db = useDatabase();
  const [activeView, setActiveView] = useState('dashboard');

  if (!user) return <LoginScreen />;

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <Dashboard 
        activeView={activeView} 
        setActiveView={setActiveView} 
        complaints={db.complaints}
        addComplaint={db.addComplaint}
        updateComplaint={db.updateComplaint}
        users={db.users}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
