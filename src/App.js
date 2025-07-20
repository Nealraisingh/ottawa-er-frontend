import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmissionForm from './components/SubmissionForm';
import WaitTimesList from './components/WaitTimesList';
import AdminPage from './components/AdminPage';
import Navbar from './components/Navbar';
import TrendsPage from './pages/TrendsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-1">
                {/* Hero */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-500 text-white py-20 shadow-lg">
                  <div className="max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-5xl font-extrabold leading-tight">
                      Ottawa ER Wait Times
                    </h1>
                    <p className="mt-4 text-xl max-w-2xl mx-auto">
                      Stay informed. Make smarter decisions. Submit updates and help the community reduce wait times.
                    </p>
                    <a
                      href="#wait-times"
                      className="inline-block mt-6 px-6 py-3 bg-white text-teal-700 font-semibold rounded shadow hover:bg-gray-100 transition"
                    >
                      View Wait Times
                    </a>
                  </div>
                </div>

                {/* Main Content */}
                <div
                  id="wait-times"
                  className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2"
                >
                  {/* Wait Times */}
                  <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                      Current Wait Times
                    </h2>
                    <WaitTimesList />
                  </div>

                  {/* Submission Form */}
                  <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition">
                    <h2 className="text-2xl font-semibold mb-4 text-teal-800">
                      Submit an Update
                    </h2>
                    <SubmissionForm />
                  </div>
                </div>

                {/* Why This Matters */}
                <div className="bg-white py-12">
                  <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-2xl font-bold text-teal-800 mb-4">
                      Why This Matters
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Emergency room wait times can vary greatly. By staying updated and contributing, you help distribute patients more evenly and reduce overcrowding.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-4xl font-bold text-teal-700">3</p>
                        <p className="text-gray-600">Major Hospitals</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-teal-700">24/7</p>
                        <p className="text-gray-600">Live Updates</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-teal-700">100%</p>
                        <p className="text-gray-600">Community Driven</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-100 text-center text-sm text-gray-600 py-4">
                  © {new Date().getFullYear()} Ottawa ER Tracker — Made with ❤️ for the community
                </footer>
              </div>
            }
          />

          <Route
            path="/admin"
            element={
              <div className="max-w-5xl mx-auto bg-gray-50 p-4">
                <AdminPage />
              </div>
            }
          />

          <Route
            path="/trends"
            element={
              <div className="max-w-6xl mx-auto bg-gray-50 p-4">
                <TrendsPage />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
