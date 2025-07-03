import React from 'react';

function HospitalCard({ name, waitTime }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Wait Time: {waitTime} minutes</p>
    </div>
  );
}

export default HospitalCard;