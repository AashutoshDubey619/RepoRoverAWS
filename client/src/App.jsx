import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import ChatInterface from './pages/ChatInterface';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <ChatInterface />
          </ProtectedRoute>
        } />

        {/* Unified Auth & Landing Page */}
        <Route path="/login" element={<Landing />} />
        <Route path="/signup" element={<Landing />} />
        <Route path="/auth" element={<Landing />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;