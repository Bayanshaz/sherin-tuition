import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    youtubeLink: '',
    subject: '',
    scheduledAt: ''
  });
  const [loading, setLoading] = useState(false);

  const subjects = [
    '8th-biology',
    '9th-biology',
    '10th-biology',
    'plusone-zoology',
    'plusone-botany',
    'plustwo-zoology',
    'plustwo-botany'
  ];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lives/teacher-lives');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/lives', formData);
      setFormData({
        title: '',
        youtubeLink: '',
        subject: '',
        scheduledAt: ''
      });
      fetchSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="live-sessions">
      <h2>Manage Live Sessions</h2>
      
      <div className="create-session">
        <h3>Create New Live Session</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>YouTube Live Link:</label>
            <input
              type="url"
              value={formData.youtubeLink}
              onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Subject:</label>
            <select
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Scheduled Date & Time:</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Session'}
          </button>
        </form>
      </div>

      <div className="sessions-list">
        <h3>Your Live Sessions</h3>
        {sessions.map(session => (
          <div key={session._id} className="session-card">
            <h4>{session.title}</h4>
            <p>Subject: {session.subject.replace('-', ' ').toUpperCase()}</p>
            <p>Scheduled: {new Date(session.scheduledAt).toLocaleString()}</p>
            <p>Status: {session.isCompleted ? 'Completed' : 'Upcoming'}</p>
            <a href={session.youtubeLink} target="_blank" rel="noopener noreferrer">
              Join Live
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveSessions;