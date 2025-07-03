import React, { useEffect, useState } from 'react';
import { getWaitTimes } from './api';

export default function WaitTimeList() {
  const [waitTimes, setWaitTimes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getWaitTimes();
      setWaitTimes(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Current ER Wait Times</h2>
      <ul>
        {waitTimes.map((entry) => (
          <li key={entry.id}>
            <strong>{entry.hospital}</strong>: {entry.waitTime} minutes
          </li>
        ))}
      </ul>
    </div>
  );
}

