import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const WaitTimeTrends = () => {
  const [data, setData] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    fetchTrendData();
  }, []);

  const fetchTrendData = async () => {
    try {
      const response = await fetch('https://ottawa-er-backend.onrender.com/wait-times/history');
      const submissions = await response.json();

      // Extract unique hospital names
      const uniqueHospitals = [...new Set(submissions.map(s => s.hospitalName))];
      setHospitals(uniqueHospitals);

      // Organize data by timestamp with wait times per hospital
      // We'll group submissions by date and map hospitals to wait times

      // Create a map: date (string) -> { hospital1: waitTime, hospital2: waitTime, ... }
      const dataMap = {};
      submissions.forEach(({ hospitalName, waitTime, timestamp }) => {
        // Format date as YYYY-MM-DD for x-axis grouping
        const dateStr = new Date(timestamp).toISOString().slice(0, 10);
        if (!dataMap[dateStr]) dataMap[dateStr] = { date: dateStr };
        dataMap[dateStr][hospitalName] = waitTime;
      });

      // Convert map to array and sort by date ascending
      const chartData = Object.values(dataMap).sort((a, b) => (a.date > b.date ? 1 : -1));

      setData(chartData);
    } catch (error) {
      console.error('Failed to fetch trend data', error);
    }
  };

  const colors = ['#bb1e1e', '#ff7f50', '#008080', '#6a5acd', '#ff6347'];

  return (
    <div style={{ width: '95%', maxWidth: '900px', margin: '40px auto', textAlign: 'center' }}>
      <h2>ER Wait Times Trends</h2>
      {data.length === 0 ? (
        <p>Loading trend data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Wait Time (min)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            {hospitals.map((hospital, index) => (
              <Line
                key={hospital}
                type="monotone"
                dataKey={hospital}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default WaitTimeTrends;
