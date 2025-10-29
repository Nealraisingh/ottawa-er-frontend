import React, { useEffect, useState } from 'react';

const AdminPage = () => {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const pendingRes = await fetch('https://ottawa-er-backend.onrender.com/admin/submissions');
      const pendingData = await pendingRes.json();
      setPendingSubmissions(pendingData);

      const approvedRes = await fetch('https://ottawa-er-backend.onrender.com/admin/approved');
      const approvedData = await approvedRes.json();
      setApprovedSubmissions(approvedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`https://ottawa-er-backend.onrender.com/admin/approve/${id}`, { method: 'POST' });
    fetchSubmissions();
  };

  const handleReject = async (id) => {
    await fetch(`https://ottawa-er-backend.onrender.com/admin/reject/${id}`, { method: 'POST' });
    fetchSubmissions();
  };

  const handleDelete = async (id) => {
    await fetch(`https://ottawa-er-backend.onrender.com/admin/delete/${id}`, { method: 'DELETE' });
    fetchSubmissions();
  };

  const handleLogin = async () => {
    const response = await fetch('https://ottawa-er-backend.onrender.com/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    if (data.success) {
      setIsAuthenticated(true);
      setError('');
      // set flag so Navbar can show Admin link (client-side convenience)
      try { localStorage.setItem('isAdmin', 'true'); } catch(e) { /* ignore */ }
    } else {
      setError('Incorrect password');
    }
  };

  // logout clears the flag and returns to homepage
  const logoutAdmin = () => {
    try { localStorage.removeItem('isAdmin'); } catch(e) { /* ignore */ }
    setIsAuthenticated(false);
    setPassword('');
    // navigate to home
    window.location.href = '/';
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min`;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border rounded"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          {error && <p className="text-red-600 mt-2 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-4"></div>
        <p className="mt-4 text-blue-700 font-medium">Loading submissions…</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-blue-800">Admin Dashboard</h2>
        <div>
          <button
            onClick={logoutAdmin}
            className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-4">
          Pending Submissions <span className="text-yellow-600">({pendingSubmissions.length})</span>
        </h3>
        {pendingSubmissions.length === 0 ? (
          <p className="text-gray-600">No pending submissions</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {pendingSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold">{submission.hospitalName}</h4>
                  <p>
                    Wait Time:{' '}
                    <span className="text-blue-700 font-medium">
                      {formatTime(submission.waitTime)}
                    </span>
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                    Pending
                  </span>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleApprove(submission._id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(submission._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-2xl font-semibold mb-4">
          Approved Submissions <span className="text-green-600">({approvedSubmissions.length})</span>
        </h3>
        {approvedSubmissions.length === 0 ? (
          <p className="text-gray-600">No approved submissions</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {approvedSubmissions.map((submission) => (
              <div
                key={submission._id}
                className="bg-white rounded shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-semibold">{submission.hospitalName}</h4>
                  <p>
                    Wait Time:{' '}
                    <span className="text-blue-700 font-medium">
                      {formatTime(submission.waitTime)}
                    </span>
                  </p>
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                    Approved
                  </span>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleDelete(submission._id)}
                    className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminPage;
