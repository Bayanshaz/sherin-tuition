import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentLives = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/lives/my-lives');
      setSessions(response.data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="student-lives">
      <h2>Live Sessions</h2>
      <div className="sessions-grid">
        {sessions.map(session => (
          <div key={session._id} className="session-card">
            <h3>{session.title}</h3>
            <p><strong>Subject:</strong> {session.subject.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Teacher:</strong> {session.conductedBy?.name}</p>
            <p><strong>Scheduled:</strong> {new Date(session.scheduledAt).toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span className={session.isCompleted ? 'completed' : 'upcoming'}>
                {session.isCompleted ? 'Completed' : 'Upcoming'}
              </span>
            </p>
            {!session.isCompleted && (
              <a 
                href={session.youtubeLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="join-btn"
              >
                Join Live Session
              </a>
            )}
            {session.isCompleted && session.recordedVideo && (
              <div className="recorded-video">
                <h4>Recorded Session:</h4>
                <video controls width="100%">
                  <source src={`http://localhost:5000/${session.recordedVideo.path}`} />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
      {sessions.length === 0 && (
        <p>No live sessions available for your subjects.</p>
      )}
    </div>
  );
};

export default StudentLives;