import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import StudentLives from './student/StudentLives';
import StudentVideos from './student/StudentVideos';
import './Dashboard.css';

const StudentDashboard = () => {
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
          <span className="subtitle">Student Portal</span>
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
          className={activeTab === 'live-sessions' ? 'active' : ''}
          onClick={() => setActiveTab('live-sessions')}
        >
          Live Sessions
        </button>
        <button 
          className={activeTab === 'videos' ? 'active' : ''}
          onClick={() => setActiveTab('videos')}
        >
          Videos
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'dashboard' && (
          <div className="welcome-section">
            <h2>Welcome to Student Dashboard</h2>
            <p>Access your live sessions and educational videos based on your enrolled subjects.</p>
            <div className="subjects-list">
              <h3>Your Subjects:</h3>
              <ul>
                {user?.subjects.map(subject => (
                  <li key={subject}>{subject.replace('-', ' ').toUpperCase()}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {activeTab === 'live-sessions' && <StudentLives />}
        {activeTab === 'videos' && <StudentVideos />}
      </main>
    </div>
  );
};

export default StudentDashboard;