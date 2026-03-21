import React, { useState } from "react";

const SubmissionForm = () => {
  const [hospital, setHospital] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const hospitals = [
    "Montfort Hospital",
    "Ottawa General Hospital",
    "Queensway Carleton Hospital",
    "CHEO",
    "Ottawa Civic Hospital"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hospital) {
      setMessage({ type: "error", text: "Please select a hospital from the list." });
      return;
    }

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const totalMinutes = h * 60 + m;

    if (totalMinutes === 0) {
      setMessage({ type: "error", text: "Please enter a valid wait time." });
      return;
    }

    setLoading(true);
    setMessage(null);

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
        setMessage({ type: "success", text: "Update submitted! Thank you for helping." });
        setHospital("");
        setHours("");
        setMinutes("");
      } else {
        setMessage({ type: "error", text: "Submission failed: " + data.error });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-2">
      
      {/* 1. Boxed Hospital Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Select Hospital
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hospitals.map((hosp) => (
            <label 
              key={hosp} 
              className={`
                cursor-pointer border rounded-xl p-3 text-center transition-all duration-200
                ${hospital === hosp 
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600 font-semibold' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-slate-50 font-medium'
                }
              `}
            >
              <input
                type="radio"
                name="hospital"
                value={hosp}
                checked={hospital === hosp}
                onChange={(e) => setHospital(e.target.value)}
                className="hidden"
              />
              <span className="text-sm">{hosp}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Hours & Minutes Inputs */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Current Wait Time
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="number"
              min="0"
              placeholder="0"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 font-medium"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-medium text-sm">hrs</span>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="59"
              placeholder="0"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 placeholder-slate-400 font-medium"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-medium text-sm">min</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dynamic Status Message & Review Prompt */}
      {message && (
        <div className={`p-5 rounded-xl text-sm flex flex-col gap-3 animate-in fade-in duration-300 ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          
          <div className="flex items-center gap-2 text-base font-bold">
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>

          {/* Google Review Call-to-Action (Only shows on success!) */}
          {message.type === 'success' && (
            <div className="mt-1 pt-4 border-t border-emerald-200/60 flex flex-col gap-3">
              <p className="text-emerald-800 font-medium text-sm leading-relaxed">
                Want to help us reach more people in Ottawa? A quick Google review makes a massive difference for our community tool!
              </p>
              <a 
                href="YOUR_GOOGLE_REVIEW_LINK_HERE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-800 border border-emerald-200 hover:border-emerald-400 hover:shadow-sm px-4 py-2.5 rounded-lg font-bold transition-all w-fit group"
              >
                <span className="text-yellow-400 text-lg leading-none tracking-widest group-hover:scale-110 transition-transform">★★★★★</span>
                Leave a Review
              </a>
            </div>
          )}
          
        </div>
      )}

      {/* 4. Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          w-full py-3.5 px-4 rounded-xl text-white font-bold text-lg shadow-md transition-all duration-200
          ${loading
            ? 'bg-slate-300 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Update"
        )}
      </button>

    </form>
  );
};

export default SubmissionForm;