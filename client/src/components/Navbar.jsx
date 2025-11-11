import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Alumni Tracking</Link>
        <div className="flex items-center gap-4">
          {user?.role === 'ADMIN' && (
            <>
              <Link className="text-sm" to="/admin">Admin</Link>
              <Link className="text-sm" to="/admin/surveys/create">Create Survey</Link>
            </>
          )}
          {user?.role === 'ALUMNI' && (
            <Link className="text-sm" to="/alumni">My Dashboard</Link>
          )}
          {user?.role === 'SCHOOL' && (
            <Link className="text-sm" to="/school">School Dashboard</Link>
          )}
          {user ? (
            <button className="text-sm text-red-600" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
          ) : (
            <Link className="text-sm" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
