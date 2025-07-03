const API_BASE = 'https://ottawa-er-backend.onrender.com'; // use your actual backend URL

export async function getWaitTimes() {
  const response = await fetch(`${API_BASE}/wait-times`);
  return response.json();
}

export async function submitWaitTime(hospital, time) {
  const response = await fetch(`${API_BASE}/submit-wait-time`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hospital, time })
  });
  return response.json();
}
