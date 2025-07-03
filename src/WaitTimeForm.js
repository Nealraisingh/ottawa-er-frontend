import React, { useState } from 'react';
import { submitWaitTime } from './api';

export default function WaitTimeForm() {
  const [hospital, setHospital] = useState('');
  const [waitTime, setWaitTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitWaitTime({ hospital, waitTime });
    alert('Submitted! We’ll email you for confirmation.');
    setHospital('');
    setWaitTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit ER Wait Time</h2>
      <input
        type="text"
        placeholder="Hospital Name"
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Wait Time (minutes)"
        value={waitTime}
        onChange={(e) => setWaitTime(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
}
