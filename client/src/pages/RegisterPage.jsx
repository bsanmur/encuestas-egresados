import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth';

const initialState = {
  email: '', password: '',
  fullName: '', phone: '', graduationYear: '', major: '', studentId: '',
  currentJobTitle: '', currentCompany: '', employmentStatus: 'SEARCHING',
  schoolId: ''
};

export default function RegisterPage() {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function update(field) { return (e) => setForm({ ...form, [field]: e.target.value }); }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const payload = { ...form, graduationYear: Number(form.graduationYear) };
      await authService.register(payload);
      navigate('/login');
    } catch (e) {
      setError(e.response?.data?.message || 'Register failed');
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Register as Alumni</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
        <input className="border p-2 rounded" placeholder="Email" type="email" value={form.email} onChange={update('email')} />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={form.password} onChange={update('password')} />
        <input className="border p-2 rounded" placeholder="Full Name" value={form.fullName} onChange={update('fullName')} />
        <input className="border p-2 rounded" placeholder="Phone" value={form.phone} onChange={update('phone')} />
        <input className="border p-2 rounded" placeholder="Graduation Year" type="number" value={form.graduationYear} onChange={update('graduationYear')} />
        <input className="border p-2 rounded" placeholder="Major" value={form.major} onChange={update('major')} />
        <input className="border p-2 rounded" placeholder="Student ID (optional)" value={form.studentId} onChange={update('studentId')} />
        <input className="border p-2 rounded" placeholder="Current Job Title" value={form.currentJobTitle} onChange={update('currentJobTitle')} />
        <input className="border p-2 rounded" placeholder="Current Company" value={form.currentCompany} onChange={update('currentCompany')} />
        <select className="border p-2 rounded" value={form.employmentStatus} onChange={update('employmentStatus')}>
          <option value="EMPLOYED">Employed</option>
          <option value="UNEMPLOYED">Unemployed</option>
          <option value="SEARCHING">Searching</option>
          <option value="FREELANCE">Freelance</option>
        </select>
        <input className="border p-2 rounded" placeholder="School ID" value={form.schoolId} onChange={update('schoolId')} />
        {error && <p className="text-red-600 text-sm col-span-full">{error}</p>}
        <button className="bg-green-600 text-white p-2 rounded col-span-full" type="submit">Register</button>
      </form>
      <div className="mt-3 text-sm">
        <Link to="/login" className="text-blue-600">Back to login</Link>
      </div>
    </div>
  );
}
