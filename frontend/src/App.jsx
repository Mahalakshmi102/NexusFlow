import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RuleCanvas from './pages/RuleCanvas';
import Alerts from './pages/Alerts';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#020617', minHeight: '100vh', color: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Navbar />
        <div style={{ padding: '0 24px 24px 24px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rules" element={<RuleCanvas />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;