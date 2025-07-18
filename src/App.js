import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmissionForm from './components/SubmissionForm';
import WaitTimesList from './components/WaitTimesList';
import AdminPage from './components/AdminPage';
import Navbar from './components/Navbar';
import TrendsPage from "./pages/TrendsPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-bold text-center text-blue-800 mt-6">
                    Ottawa ER Wait Times
                  </h1>

                  <div className="max-w-4xl mx-auto grid gap-6 mt-8">
                    <div className="bg-white shadow-md rounded-lg p-6">
                      <WaitTimesList />
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-6">
                      <SubmissionForm />
                    </div>
                  </div>
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6 mt-6">
                  <AdminPage />
                </div>
              }
            />
            <Route
              path="/trends"
              element={
                <TrendsPage />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
