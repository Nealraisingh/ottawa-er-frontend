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

  if (loading) {
    return (
      <div className="wait-times-list" style={{ textAlign: "center", padding: "20px" }}>
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 border-4 mx-auto"></div>
        <p>Loading wait times…</p>
      </div>
    );
  }

  return (
    <div className="wait-times-list" style={{ textAlign: "center" }}>
      <h2>Current ER Wait Times</h2>
      {approvedSubmissions.length === 0 ? (
        <p>No approved wait times yet. Check back soon!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {approvedSubmissions.map((submission) => {
            const hours = Math.floor(submission.waitTime / 60);
            const minutes = submission.waitTime % 60;
            const timestamp = new Date(submission.timestamp).toLocaleString();

            return (
              <li
                key={submission._id}
                style={{
                  marginBottom: "15px",
                  fontSize: "1.3rem",
                  color: "#bb1e1e",
                  fontWeight: "600",
                }}
              >
                <strong>{submission.hospitalName}</strong>: {hours} hr {minutes} min
                <br />
                <small style={{ color: "#666" }}>
                  Submitted: {timestamp}
                </small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WaitTimesList;
