import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PublicPortfolio from './pages/PublicPortfolio';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-status">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      {/* Vanity URL: everything else is a public portfolio username */}
      <Route path="/:username" element={<PublicPortfolio />} />
    </Routes>
  );
}
