import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const StudentVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos/my-videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideosBySubject = (subject) => {
    return videos.filter(video => video.subject === subject);
  };

  const getSubjectsWithVideos = () => {
    const subjectsWithVideos = {};
    user.subjects.forEach(subject => {
      const subjectVideos = getVideosBySubject(subject);
      if (subjectVideos.length > 0) {
        subjectsWithVideos[subject] = subjectVideos;
      }
    });
    return subjectsWithVideos;
  };

  if (loading) return <div className="loading">Loading videos...</div>;

  const subjectsWithVideos = getSubjectsWithVideos();

  return (
    <div className="student-videos">
      <h2>Educational Videos</h2>

      {!selectedSubject ? (
        <div className="subjects-selection">
          <h3>Select Your Subject</h3>
          <p>Choose a subject to view available videos</p>
          
          <div className="subjects-grid">
            {user.subjects.map(subject => {
              const subjectVideos = getVideosBySubject(subject);
              return (
                <div 
                  key={subject} 
                  className={`subject-card ${subjectVideos.length === 0 ? 'disabled' : ''}`}
                  onClick={() => subjectVideos.length > 0 && setSelectedSubject(subject)}
                >
                  <div className="subject-icon">
                    {subject.includes('biology') ? '🔬' : 
                     subject.includes('zoology') ? '🐾' : '🌿'}
                  </div>
                  <h4>{subject.replace('-', ' ').toUpperCase()}</h4>
                  <p>{subjectVideos.length} videos available</p>
                  {subjectVideos.length === 0 && (
                    <div className="no-videos-label">No videos yet</div>
                  )}
                  {subjectVideos.length > 0 && (
                    <div className="subject-action">Click to View Videos</div>
                  )}
                </div>
              );
            })}
          </div>

          {Object.keys(subjectsWithVideos).length === 0 && (
            <div className="no-videos-message">
              <h4>No videos available for your subjects yet.</h4>
              <p>Your teacher will upload videos soon for your enrolled subjects.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="subject-videos-view">
          <div className="subject-header">
            <button 
              className="back-button"
              onClick={() => setSelectedSubject(null)}
            >
              ← Back to Subjects
            </button>
            <h3>{selectedSubject.replace('-', ' ').toUpperCase()} Videos</h3>
            <p>{getVideosBySubject(selectedSubject).length} videos available</p>
          </div>

          <div className="videos-grid">
            {getVideosBySubject(selectedSubject).map(video => (
              <div key={video._id} className="video-card">
                <h4>{video.title}</h4>
                {video.description && <p className="video-description">{video.description}</p>}
                <p className="video-meta">
                  <strong>Teacher:</strong> {video.uploadedBy?.name}<br/>
                  <strong>Uploaded:</strong> {new Date(video.uploadedAt).toLocaleDateString()}
                </p>
                <video controls width="100%">
                  <source src={`http://localhost:5000/${video.path}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVideos;