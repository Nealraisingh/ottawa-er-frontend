import React, { useState } from "react";

const SubmissionForm = () => {
  const [hospital, setHospital] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospital) {
      setMessage("Please select a hospital.");
      return;
    }

    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://ottawa-er-backend.onrender.com/submit-wait-time",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            hospital,
            waitTime: totalMinutes,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("✅ Submission successful!");
        setHospital("");
        setHours(0);
        setMinutes(0);
      } else {
        setMessage("❌ Submission failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Submission failed: Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Submit Updated Wait Time</h2>

      <div>
        <label className="block mb-1 font-medium">Select Hospital</label>
        <select
          className="w-full border rounded-lg p-2"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          required
        >
          <option value="">-- Select --</option>
          <option>Montfort Hospital</option>
          <option>Ottawa General Hospital</option>
          <option>Queensway Carleton Hospital</option>
          <option>CHEO</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Hours</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            min="0"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Minutes</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            min="0"
            max="59"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>

      {message && (
        <p
          className={`mt-2 font-medium ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default SubmissionForm;
