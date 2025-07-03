import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubmissionForm from './components/SubmissionForm';
import WaitTimesList from './components/WaitTimesList';
import WaitTimeTrends from './components/WaitTimeTrends';  // <-- added import
import AdminPage from './components/AdminPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1>Ottawa ER Wait Times</h1>

                  <div className="card">
                    <WaitTimesList />
                  </div>

                  <div className="card">
                    <WaitTimeTrends />  {/* <-- added trends here */}
                  </div>

                  <div className="card">
                    <SubmissionForm />
                  </div>
                </>
              }
            />
            <Route
              path="/admin"
              element={
                <div className="card admin-card">
                  <AdminPage />
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
