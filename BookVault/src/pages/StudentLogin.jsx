import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For redirecting after successful login
import './StudentLogin.css'; // Add any necessary styles

function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { studentId, password };

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage(data.message); // Show the success message
        setError(''); // Clear any previous error messages

        // Store the student data in localStorage (no token)
        localStorage.setItem('student', JSON.stringify({
          studentId: data.studentId,
          fullName: data.fullName,
          email: data.email,
          branch: data.branch,
        }));

        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          navigate('/student-dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Invalid credentials');
        setSuccessMessage('');
      }
    } catch (error) {
      setError('Error connecting to the server');
      setSuccessMessage('');
    }
  };

  return (
    <div className="student-login-container">
      <h2>Student Login</h2>
      {error && <div className="error">{error}</div>}
      {successMessage && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Student ID</label>
          <input
            type="text"
            id="studentId"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="signup-link">
        <p>Don't have an account? <Link to="/student-signup">Sign up here</Link></p>
      </div>
    </div>
  );
}

export default StudentLogin;
