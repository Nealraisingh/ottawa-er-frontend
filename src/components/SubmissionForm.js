import React, { useState } from 'react';

const hospitals = [
  'Ottawa General Hospital',
  'Queensway Carleton Hospital',
  'Montfort Hospital',
  'CHEO',
  'Civic Hospital',
];

const SubmissionForm = () => {
  const [hospital, setHospital] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalMinutes = parseInt(hours || 0) * 60 + parseInt(minutes || 0);

    if (!hospital || totalMinutes <= 0) {
      alert('Please enter all fields correctly.');
      return;
    }

    try {
      const response = await fetch(
        'https://ottawa-er-backend.onrender.com/submit-wait-time',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ hospital, waitTime: totalMinutes }),
        }
      );

      if (response.ok) {
        alert('Submission sent successfully!');
        setHospital('');
        setHours('');
        setMinutes('');
      } else {
        alert('Submission failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting. Check your connection.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="submission-form" style={{ maxWidth: '320px', margin: '0 auto' }}>
      <h2>Submit Updated Wait Time</h2>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <select
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          required
        >
          <option value="">Select hospital</option>
          {hospitals.map((hosp) => (
            <option key={hosp} value={hosp}>
              {hosp}
            </option>
          ))}
        </select>
        <label>Hospital</label>
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <input
          type="number"
          min="0"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder=" "
          required
        />
        <label>Hours</label>
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <input
          type="number"
          min="0"
          max="59"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder=" "
          required
        />
        <label>Minutes</label>
      </div>

      <button type="submit" className="btn-submit" style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
        Submit
      </button>
    </form>
  );
};

export default SubmissionForm;
