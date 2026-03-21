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

  // Modern Loading State
  if (!trends) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative flex justify-center items-center">
          <div className="absolute animate-ping h-12 w-12 rounded-full bg-blue-200 opacity-75"></div>
          <div className="relative rounded-full h-12 w-12 bg-blue-600 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <p className="text-slate-500 mt-6 text-lg font-medium animate-pulse">Analyzing historical data...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8 border-b border-slate-100 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ER Wait Time Trends
        </h1>
        <p className="text-slate-500 mt-2 text-lg max-w-2xl">
          Average wait times by day of the week, based on verified community submissions. Use this data to anticipate peak hours.
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        
        {/* Chart Type Selector (iOS Style Segmented Control) */}
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700 text-sm uppercase tracking-wider">View As:</span>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setChartType("bar")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                chartType === "bar"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType("line")}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                chartType === "line"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Line Trend
            </button>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 gap-10">
          {Object.keys(trends).map((hospital) => {
            const chartData = daysOrder.map((day) => ({
              day: day.slice(0, 3), // Shorten days to Mon, Tue, etc. for cleaner x-axis
              fullDay: day,
              waitTime: trends[hospital][day] || 0,
            }));

            return (
              <div
                key={hospital}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                  {hospital}
                </h2>

                <div className="w-full bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                  <ResponsiveContainer width="100%" height={320}>
                    {chartType === "bar" ? (
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 13 }} 
                          tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                          labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#0f172a', fontWeight: '800', fontSize: '16px' }}
                          formatter={(value) => [formatTime(value), "Avg Wait"]}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDay || label}
                        />
                        {/* radius makes the top corners of the bars rounded */}
                        <Bar dataKey="waitTime" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} 
                          dy={10} 
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 13 }} 
                          tickFormatter={(value) => `${value}m`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                          labelStyle={{ color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}
                          itemStyle={{ color: '#0f172a', fontWeight: '800', fontSize: '16px' }}
                          formatter={(value) => [formatTime(value), "Avg Wait"]}
                          labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDay || label}
                        />
                        <Line
                          type="monotone"
                          dataKey="waitTime"
                          stroke="#2563eb"
                          strokeWidth={4}
                          dot={{ r: 5, strokeWidth: 2, fill: '#ffffff', stroke: '#2563eb' }}
                          activeDot={{ r: 7, fill: '#2563eb', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendsPage;