import React, { useEffect, useState } from "react";

const WaitTimesList = () => {
  const [approvedSubmissions, setApprovedSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovedSubmissions();
  }, []);

  const fetchApprovedSubmissions = async () => {
    try {
      const response = await fetch(
        "https://ottawa-er-backend.onrender.com/wait-times"
      );
      const data = await response.json();
      setApprovedSubmissions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMapsLink = (hospitalName) => {
    const query = encodeURIComponent(hospitalName + " Ottawa");
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 border-4 mx-auto"></div>
        <p className="text-teal-700 mt-2">Loading wait times…</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-teal-800 mb-4">Current ER Wait Times</h2>
      {approvedSubmissions.length === 0 ? (
        <p className="text-gray-600">No approved wait times yet. Check back soon!</p>
      ) : (
        <ul className="space-y-4">
          {approvedSubmissions.map((submission) => {
            const hours = Math.floor(submission.waitTime / 60);
            const minutes = submission.waitTime % 60;
            const timestamp = new Date(submission.timestamp).toLocaleString();

            return (
              <li
                key={submission._id}
                className="text-lg font-semibold text-teal-700"
              >
                <strong>{submission.hospitalName}</strong>: {hours} hr {minutes} min
                <br />
                <small className="text-gray-600">Submitted: {timestamp}</small>
                <br />
                <a
                  href={getMapsLink(submission.hospitalName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-sm text-teal-600 hover:underline"
                >
                  📍 Get Directions
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WaitTimesList;
