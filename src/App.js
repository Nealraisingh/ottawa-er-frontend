import React from 'react';
import './App.css';

const hospitals = [
  { name: "The Ottawa Hospital - General Campus", waitTime: "3h 20m", updated: "10 min ago" },
  { name: "CHEO", waitTime: "1h 45m", updated: "5 min ago" },
  { name: "Montfort Hospital", waitTime: "2h 30m", updated: "15 min ago" },
];

function App() {
  return (
    <div className="app">
      <header>
        <h1>Ottawa ER Wait Times</h1>
      </header>
      <div className="hospital-list">
        {hospitals.map((hospital, index) => (
          <div key={index} className="hospital-card">
            <h2>{hospital.name}</h2>
            <p><strong>Wait Time:</strong> {hospital.waitTime}</p>
            <p><em>Last updated: {hospital.updated}</em></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;