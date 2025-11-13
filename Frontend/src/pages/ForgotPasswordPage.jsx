import { useState } from 'react';
import { authService } from '../services/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    const r = await authService.forgotPassword(email);
    setMsg(r.message);
  }
  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Forgot Password</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Send reset</button>
      </form>
      {msg && <p className="text-green-700 mt-2 text-sm">{msg}</p>}
    </div>
  );
}
