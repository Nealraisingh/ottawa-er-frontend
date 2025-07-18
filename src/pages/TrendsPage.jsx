import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const TrendsPage = () => {
  const [trends, setTrends] = useState(null);

  useEffect(() => {
    fetch("/api/trends")
      .then(res => res.json())
      .then(data => setTrends(data))
      .catch(err => console.error("Failed to fetch trends:", err));
  }, []);

  const daysOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? `${hrs} hr ` : ""}${mins} min`;
  };

  if (!trends) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Loading trends...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        ER Wait Time Trends (Averages by Day)
      </h1>

      <div className="space-y-12 max-w-6xl mx-auto">
        {Object.keys(trends).map(hospital => {
          const chartData = daysOrder.map(day => ({
            day,
            waitTime: trends[hospital][day] || 0,
          }));

          return (
            <div
              key={hospital}
              className="bg-white rounded-xl shadow-md p-4"
            >
              <h2 className="text-xl font-semibold mb-4 text-blue-700">
                {hospital}
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatTime(value)} />
                  <Bar dataKey="waitTime" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendsPage;
