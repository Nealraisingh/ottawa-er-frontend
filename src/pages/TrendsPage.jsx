import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendsPage = () => {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetch("https://ottawa-er-backend.onrender.com/api/trends")
      .then((res) => res.json())
      .then((data) => setTrends(data))
      .catch((err) => console.error("Failed to fetch trends:", err));
  }, []);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr ` : ""}${mins} min`;
  };

  if (!trends) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 border-4 mx-auto"></div>
        <p className="text-teal-700 mt-2">Loading trends…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-500 text-white py-12 shadow">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl font-bold">ER Wait Time Trends</h1>
          <p className="mt-2 text-lg">
            Average wait times by day of the week, based on past community submissions.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
        {Object.keys(trends).map((hospital) => {
          const chartData = daysOrder.map((day) => ({
            day,
            waitTime: trends[hospital][day] || 0,
          }));

          return (
            <div
              key={hospital}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                {hospital}
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTime(value)} />
                  <Bar dataKey="waitTime" fill="#0d9488" /> {/* teal-600 */}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4 mt-8">
        © {new Date().getFullYear()} Ottawa ER Tracker — Made with ❤️ for the community
      </footer>
    </div>
  );
};

export default TrendsPage;
