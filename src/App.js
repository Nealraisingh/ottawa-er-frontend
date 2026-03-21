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
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
        <Navbar />

        <Routes>
          <Route
            path="/"
            element={
              <div className="flex-1 flex flex-col">
                {/* Hero / Header Section */}
                <header className="bg-gradient-to-r from-blue-900 to-sky-800 shadow-md">
                  <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                      Ottawa ER Wait Times
                    </h1>
                    <p className="text-sky-100 text-lg md:text-xl max-w-2xl mx-auto md:mx-0 font-medium">
                      Stay informed. Make smarter decisions. Submit real-time updates to help reduce ER wait times across Ottawa.
                    </p>
                  </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                  
                  {/* Left: Wait Times List (Takes up 8 columns on large screens) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-slate-900">
                        Current Wait Times
                      </h2>
                      <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        <span className="ml-2 text-sm text-slate-500 font-medium absolute left-4 -top-1">Live</span>
                      </span>
                    </div>
                    {/* The WaitTimesList component will render here */}
                    <WaitTimesList />
                  </div>

                  {/* Right: Submission Form (Takes up 4 columns on large screens & is sticky) */}
                  <div className="lg:col-span-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:sticky lg:top-8">
                      <h2 className="text-xl font-bold text-slate-900 mb-2 border-b border-slate-100 pb-3">
                        Submit an Update
                      </h2>
                      <p className="text-sm text-slate-500 mb-6">
                        Are you currently at an ER? Help others by reporting the current wait time.
                      </p>
                      <SubmissionForm />
                    </div>
                  </div>
                </main>

                {/* Why This Matters Section */}
                <section className="bg-white border-t border-slate-200 py-16 mt-auto">
                  <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Why Your Input Matters
                    </h2>
                    <p className="text-slate-600 mb-12 max-w-2xl mx-auto text-lg">
                      Emergency room wait times can change in minutes. By staying updated and contributing, 
                      you help distribute patients evenly, reducing overcrowding and saving lives.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {/* Stat Card 1 */}
                      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-5xl font-extrabold text-blue-800 mb-2">3</p>
                        <p className="text-slate-700 font-semibold text-lg">Major Hospitals</p>
                      </div>
                      {/* Stat Card 2 */}
                      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-5xl font-extrabold text-blue-800 mb-2">24/7</p>
                        <p className="text-slate-700 font-semibold text-lg">Live Updates</p>
                      </div>
                      {/* Stat Card 3 */}
                      <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow">
                        <p className="text-5xl font-extrabold text-blue-800 mb-2">100%</p>
                        <p className="text-slate-700 font-semibold text-lg">Community Driven</p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-900 border-t border-slate-800 text-center py-10 mt-auto">
                  <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-4">
                    
                    {/* Instagram Button */}
                    <a 
                      href="https://www.instagram.com/otterwaittimes?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 hover:text-white transition-all duration-300 border border-slate-700 hover:border-slate-500 shadow-sm"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-sm tracking-wide">Follow us on Instagram</span>
                    </a>

                    <p className="text-sm text-slate-500 mt-2">
                      © {new Date().getFullYear()} Ottawa ER Tracker — Made with ❤️ for the community
                    </p>
                  </div>
                </footer>
              </div>
            }
          />

          <Route
            path="/admin"
            element={
              <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 my-10">
                <AdminPage />
              </div>
            }
          />

          <Route
            path="/trends"
            element={
              <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 my-10">
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