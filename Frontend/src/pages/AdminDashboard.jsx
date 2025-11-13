import ManageAlumni from '../components/Admin/ManageAlumni.jsx';
import ManageSchools from '../components/Admin/ManageSchools.jsx';
import GlobalAnalytics from '../components/Admin/GlobalAnalytics.jsx';
import { useState } from 'react';

export default function AdminDashboard() {
  const [tab, setTab] = useState('analytics');
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin Dashboard - Tracking & Analytics</h1>
      </div>
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 rounded-t ${tab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setTab('analytics')}
        >
          Global Analytics
        </button>
        <button
          className={`px-4 py-2 rounded-t ${tab === 'alumni' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setTab('alumni')}
        >
          Manage Alumni
        </button>
        <button
          className={`px-4 py-2 rounded-t ${tab === 'schools' ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => setTab('schools')}
        >
          Manage Schools
        </button>
      </div>
      {tab === 'analytics' && <GlobalAnalytics />}
      {tab === 'alumni' && <ManageAlumni />}
      {tab === 'schools' && <ManageSchools />}
    </div>
  );
}
