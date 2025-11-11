import ManageAlumni from '../components/Admin/ManageAlumni.jsx';
import ManageSchools from '../components/Admin/ManageSchools.jsx';
import { useState } from 'react';

export default function AdminDashboard() {
  const [tab, setTab] = useState('alumni');
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="flex gap-2">
        <button className={`px-3 py-1 rounded ${tab==='alumni' ? 'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setTab('alumni')}>Manage Alumni</button>
        <button className={`px-3 py-1 rounded ${tab==='schools' ? 'bg-blue-600 text-white':'bg-gray-200'}`} onClick={()=>setTab('schools')}>Manage Schools</button>
      </div>
      {tab === 'alumni' ? <ManageAlumni /> : <ManageSchools />}
    </div>
  );
}
