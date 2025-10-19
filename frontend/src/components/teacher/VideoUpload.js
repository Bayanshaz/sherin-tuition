import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VideoUpload = () => {
  const [videos, setVideos] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    video: null
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' or 'upload'

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
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/videos/teacher-videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleFileChange = (e) => {
    setFormData({...formData, video: e.target.files[0]});
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setFormData({...formData, subject});
    setActiveTab('upload');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const uploadData = new FormData();
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('subject', formData.subject);
    uploadData.append('video', formData.video);

    try {
      await axios.post('http://localhost:5000/api/videos', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({
        title: '',
        description: '',
        subject: selectedSubject,
        video: null
      });
      fetchVideos();
      setActiveTab('subjects');
    } catch (error) {
      console.error('Error uploading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVideosBySubject = (subject) => {
    return videos.filter(video => video.subject === subject);
  };

  return (
    <div className="video-upload">
      <h2>Upload Video</h2>

      <div className="upload-tabs">
        <button 
          className={activeTab === 'subjects' ? 'active' : ''}
          onClick={() => setActiveTab('subjects')}
        >
          Select Subject
        </button>
        <button 
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => setActiveTab('upload')}
          disabled={!selectedSubject}
        >
          Upload Video
        </button>
      </div>

      {activeTab === 'subjects' && (
        <div className="subjects-selection">
          <h3>Choose Subject to Upload Video</h3>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <div 
                key={subject} 
                className="subject-card"
                onClick={() => handleSubjectSelect(subject)}
              >
                <div className="subject-icon">📚</div>
                <h4>{subject.replace('-', ' ').toUpperCase()}</h4>
                <p>{getVideosBySubject(subject).length} videos uploaded</p>
                <div className="subject-action">Click to Upload</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upload' && selectedSubject && (
        <div className="upload-form">
          <div className="upload-header">
            <h3>Upload Video for {selectedSubject.replace('-', ' ').toUpperCase()}</h3>
            <button 
              className="back-button"
              onClick={() => setActiveTab('subjects')}
            >
              ← Back to Subjects
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Video Title:</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                placeholder="Enter video title"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter video description"
                rows="4"
              />
            </div>
            <div className="form-group">
              <label>Selected Subject:</label>
              <div className="selected-subject">
                {selectedSubject.replace('-', ' ').toUpperCase()}
              </div>
            </div>
            <div className="form-group">
              <label>Video File:</label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
              <small>Supported formats: MP4, AVI, MOV, MKV, WMV (Max: 100MB)</small>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : `Upload to ${selectedSubject.replace('-', ' ').toUpperCase()}`}
            </button>
          </form>
        </div>
      )}

      <div className="videos-list">
        <h3>Your Uploaded Videos</h3>
        {subjects.map(subject => {
          const subjectVideos = getVideosBySubject(subject);
          if (subjectVideos.length === 0) return null;
          
          return (
            <div key={subject} className="subject-videos-section">
              <h4 className="subject-section-title">
                {subject.replace('-', ' ').toUpperCase()} ({subjectVideos.length} videos)
              </h4>
              <div className="videos-grid">
                {subjectVideos.map(video => (
                  <div key={video._id} className="video-card">
                    <h5>{video.title}</h5>
                    <p>{video.description}</p>
                    <p className="video-meta">
                      Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                    </p>
                    <video controls width="100%">
                      <source src={`http://localhost:5000/${video.path}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {videos.length === 0 && (
          <div className="no-videos">
            <p>No videos uploaded yet. Select a subject above to start uploading.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;