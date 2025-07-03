import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    try {
      const pendingRes = await fetch('https://ottawa-er-backend.onrender.com/admin/submissions');
      const pendingData = await pendingRes.json();
      setPendingSubmissions(pendingData);

      const approvedRes = await fetch('https://ottawa-er-backend.onrender.com/admin/approved');
      const approvedData = await approvedRes.json();
      setApprovedSubmissions(approvedData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`https://ottawa-er-backend.onrender.com/admin/approve/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // New reject handler
  const handleReject = async (id) => {
    try {
      const response = await fetch(`https://ottawa-er-backend.onrender.com/admin/reject/${id}`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchSubmissions();
      } else {
        console.error('Failed to reject submission');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://ottawa-er-backend.onrender.com/admin/delete/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://ottawa-er-backend.onrender.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      console.error(err);
      setError('Login error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <h2>Admin Page</h2>

      <h3>Pending Submissions</h3>
      {pendingSubmissions.length === 0 ? (
        <p>No pending submissions</p>
      ) : (
        <ul>
          {pendingSubmissions.map((submission) => (
            <li key={submission._id}>
              {submission.hospitalName} - {submission.waitTime} min
              <button onClick={() => handleApprove(submission._id)}>Approve</button>
              {/* New Reject button */}
              <button onClick={() => handleReject(submission._id)}>Reject</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Approved Submissions</h3>
      {approvedSubmissions.length === 0 ? (
        <p>No approved submissions</p>
      ) : (
        <ul>
          {approvedSubmissions.map((submission) => (
            <li key={submission._id}>
              {submission.hospitalName} - {submission.waitTime} min
              <button onClick={() => handleDelete(submission._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminPage;
