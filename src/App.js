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
                {/* Header Section */}
                <header className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl font-bold text-blue-900">
                      Ottawa ER Wait Times
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                      Stay informed. Make smarter decisions. Submit updates to help reduce ER wait times in Ottawa.
                    </p>
                  </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Wait Times */}
                  <div className="lg:col-span-2">
                    <WaitTimesList />
                  </div>

                  {/* Right: Submission Form */}
                  <div className="bg-white shadow rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Submit an Update
                    </h2>
                    <SubmissionForm />
                  </div>
                </main>

                {/* Why This Matters Section */}
                <section className="bg-white py-12">
                  <div className="max-w-5xl mx-auto text-center px-4">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">
                      Why This Matters
                    </h2>
                    <p className="text-gray-700 mb-8 max-w-3xl mx-auto">
                      Emergency room wait times can vary greatly. By staying updated and contributing, 
                      you help distribute patients more evenly and reduce overcrowding.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <p className="text-4xl font-bold text-blue-900">3</p>
                        <p className="text-gray-600">Major Hospitals</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-blue-900">24/7</p>
                        <p className="text-gray-600">Live Updates</p>
                      </div>
                      <div>
                        <p className="text-4xl font-bold text-blue-900">100%</p>
                        <p className="text-gray-600">Community Driven</p>
                      </div>
                    </div>
                  </div>
                </section>

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
