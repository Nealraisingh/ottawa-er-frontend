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
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-4"></div>
        <p className="text-blue-700 mt-4 text-lg font-medium">
          Loading wait times…
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-900 mb-8">
        Emergency Department Wait Times
      </h1>

      {approvedSubmissions.length === 0 ? (
        <p className="text-gray-600 text-lg">
          No approved wait times yet. Check back soon!
        </p>
      ) : (
        <div className="space-y-6">
          {approvedSubmissions.map((submission) => {
            const hours = Math.floor(submission.waitTime / 60);
            const minutes = submission.waitTime % 60;
            const timestamp = new Date(submission.timestamp).toLocaleString([], {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={submission._id}
                className="bg-white p-6 rounded-xl shadow border"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {submission.hospitalName}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Submitted: {timestamp}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-900 font-semibold text-lg">
                    <span role="img" aria-label="clock">⏱</span>
                    <span>
                      {hours} hr {minutes} min
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={getMapsLink(submission.hospitalName)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
                    >
                      Open Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WaitTimesList;
