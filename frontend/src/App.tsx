import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CMSDashboard from './pages/CMSDashboard';
import CasesTracker from './pages/CasesTracker';
import LexAI from './pages/LexAI';
import SMSDashboard from './pages/SMSDashboard';
import './App.css'; // Make sure this is imported

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Default route redirecting to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* CMS Dashboard */}
        <Route path="/cms-dashboard" element={<CMSDashboard />} />

        {/* Cases Tracker */}
        <Route path="/cases-tracker" element={<CasesTracker />} />

        {/* Lex AI */}
        <Route path="/lex-ai" element={<LexAI />} />

        {/* SMS Dashboard */}
        <Route path="/sms-dashboard" element={<SMSDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;