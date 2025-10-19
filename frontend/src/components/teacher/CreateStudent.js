import React, { useState } from 'react';
import axios from 'axios';

const CreateStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    subjects: []
  });
  const [message, setMessage] = useState('');
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

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/students', formData);
      setMessage('Student created successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        subjects: []
      });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error creating student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-student">
      <h2>Create Student Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <div className="form-group">
          <label>Subjects:</label>
          <div className="subjects-grid">
            {subjects.map(subject => (
              <label key={subject} className="subject-checkbox">
                <input
                  type="checkbox"
                  checked={formData.subjects.includes(subject)}
                  onChange={() => handleSubjectChange(subject)}
                />
                {subject.replace('-', ' ').toUpperCase()}
              </label>
            ))}
          </div>
        </div>
        {message && <div className="message">{message}</div>}
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Student'}
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;