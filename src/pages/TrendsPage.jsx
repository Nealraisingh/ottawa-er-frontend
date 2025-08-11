import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TrendsPage = () => {
  const [trends, setTrends] = useState(null);
  const [chartType, setChartType] = useState("bar"); // "bar" or "line"

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
      <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-4"></div>
        <p className="text-blue-700 mt-4 text-lg font-medium">Loading trends…</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-blue-900">
            ER Wait Time Trends
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Average wait times by day of the week, based on past community submissions.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Chart Type Selector */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-medium text-gray-700">Chart Type:</span>
          <button
            onClick={() => setChartType("bar")}
            className={`px-4 py-2 rounded-lg border ${
              chartType === "bar"
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Bar
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`px-4 py-2 rounded-lg border ${
              chartType === "line"
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-blue-900 border-gray-300 hover:bg-gray-100"
            }`}
          >
            Line
          </button>
        </div>

        {Object.keys(trends).map((hospital) => {
          const chartData = daysOrder.map((day) => ({
            day,
            waitTime: trends[hospital][day] || 0,
          }));

          return (
            <div
              key={hospital}
              className="bg-white rounded-xl shadow p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {hospital}
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatTime(value)} />
                    <Bar dataKey="waitTime" fill="#1E3A8A" />
                  </BarChart>
                ) : (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatTime(value)} />
                    <Line
                      type="monotone"
                      dataKey="waitTime"
                      stroke="#1E3A8A"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default TrendsPage;
