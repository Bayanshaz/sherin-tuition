import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CreateStudent from './teacher/CreateStudent';
import LiveSessions from './teacher/LiveSessions';
import VideoUpload from './teacher/VideoUpload';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-brand">
          <h1>Sherin Tuition</h1>
          <span className="subtitle">Teacher Portal</span>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'create-student' ? 'active' : ''}
          onClick={() => setActiveTab('create-student')}
        >
          Create Student
        </button>
        <button 
          className={activeTab === 'live-sessions' ? 'active' : ''}
          onClick={() => setActiveTab('live-sessions')}
        >
          Live Sessions
        </button>
        <button 
          className={activeTab === 'upload-video' ? 'active' : ''}
          onClick={() => setActiveTab('upload-video')}
        >
          Upload Video
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="welcome-section">
            <h2>Welcome to Teacher Dashboard</h2>
            <p>Manage your students, conduct live sessions, and upload educational videos.</p>
          </div>
        )}
        {activeTab === 'create-student' && <CreateStudent />}
        {activeTab === 'live-sessions' && <LiveSessions />}
        {activeTab === 'upload-video' && <VideoUpload />}
      </main>
    </div>
  );
};

export default TeacherDashboard;