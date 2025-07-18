import React from "react";

const SubmissionForm = () => {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Submit Updated Wait Time</h2>

      <div>
        <label className="block mb-1 font-medium">Select Hospital</label>
        <select
          className="w-full border rounded-lg p-2"
        >
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
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Minutes</label>
          <input
            type="number"
            className="w-full border rounded-lg p-2"
            min="0"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
};

export default SubmissionForm;
