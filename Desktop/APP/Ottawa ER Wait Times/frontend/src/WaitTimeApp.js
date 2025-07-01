import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const hospitals = [
  {
    name: 'Ottawa General Hospital',
    waitTime: '3 hrs',
    location: '501 Smyth Rd',
    coordinates: { lat: 45.4035, lng: -75.6501 },
  },
  {
    name: 'Queensway Carleton Hospital',
    waitTime: '1.5 hrs',
    location: '3045 Baseline Rd',
    coordinates: { lat: 45.3451, lng: -75.8030 },
  },
  {
    name: 'Montfort Hospital',
    waitTime: '2 hrs',
    location: '713 Montreal Rd',
    coordinates: { lat: 45.4481, lng: -75.6203 },
  },
];

export default function WaitTimeApp() {
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userInputs, setUserInputs] = useState({});

  const handleInputChange = (index, value) => {
    setUserInputs({ ...userInputs, [index]: value });
  };

  const handleSubmit = async (index) => {
    const hospital = hospitals[index];
    const newTime = userInputs[index];

    if (!newTime) return alert("Please enter a wait time.");

    try {
      await fetch("https://ottawa-er-backend.onrender.com/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalName: hospital.name,
          newWaitTime: newTime,
        }),
      });
      alert(`A request to update ${hospital.name} to "${newTime}" has been sent to nealsinghrai@gmail.com.`);
    } catch (error) {
      alert("Failed to send update. Please try again later.");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hospitals.map((hospital, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="rounded-2xl shadow-md p-4 hover:shadow-lg">
            <CardContent>
              <h2 className="text-xl font-bold mb-2">{hospital.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <MapPin className="inline w-4 h-4 mr-1" /> {hospital.location}
              </p>
              <p className="text-lg font-semibold text-blue-600">Wait: {hospital.waitTime}</p>
              <Button className="mt-4 w-full" onClick={() => setSelectedHospital(hospital)}>
                Get Directions
              </Button>
              <div className="mt-4">
                <Input
                  placeholder="Suggest new wait time (e.g. 1 hr)"
                  value={userInputs[index] || ''}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className="mb-2"
                />
                <Button variant="outline" onClick={() => handleSubmit(index)} className="w-full">
                  Submit Time Update
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {selectedHospital && (
        <div className="fixed bottom-4 left-4 right-4 bg-white p-4 shadow-lg rounded-xl">
          <p className="text-center font-semibold">
            Navigate to: {selectedHospital.name} ({selectedHospital.location})
          </p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              selectedHospital.location
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="mt-2 w-full">Open in Google Maps</Button>
          </a>
        </div>
      )}
    </div>
  );
}