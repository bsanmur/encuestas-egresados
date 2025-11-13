import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const data = await authService.login(email, password);
      login(data);
      const role = data.user.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'ALUMNI') navigate('/alumni');
      else if (role === 'SCHOOL') navigate('/school');
      else navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border p-2 rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white p-2 rounded" type="submit">Login</button>
      </form>
      <div className="mt-3 text-sm flex justify-between">
        <Link to="/register" className="text-blue-600">Register</Link>
        <Link to="/forgot-password" className="text-blue-600">Forgot password?</Link>
      </div>
    </div>
  );
}
