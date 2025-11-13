import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

export default function ManageAlumni() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const r = await adminService.listAlumni();
      setRows(r);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load alumni');
      console.error('Load alumni error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => 
    r.fullName?.toLowerCase().includes(query.toLowerCase()) || 
    r.user?.email?.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center text-gray-500">Loading alumni data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button
          onClick={load}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-semibold">Manage Alumni</h2>
          <p className="text-sm text-gray-500">Total: {rows.length} alumni</p>
        </div>
        <input 
          className="border p-2 rounded" 
          placeholder="Search by name or email" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
        />
      </div>
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {query ? 'No alumni found matching your search' : 'No alumni registered yet'}
          </div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Major</th>
                <th className="p-2">Graduation</th>
                <th className="p-2">School</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{a.fullName}</td>
                  <td className="p-2">{a.user?.email}</td>
                  <td className="p-2">{a.major}</td>
                  <td className="p-2">{a.graduationYear}</td>
                  <td className="p-2">{a.school?.name || 'N/A'}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${a.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {a.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    {!a.isApproved && (
                      <button
                        className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        onClick={async () => {
                          try {
                            await adminService.approveAlumni(a.id);
                            load();
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to approve alumni');
                          }
                        }}
                      >
                        Approve
                      </button>
                    )}
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete ${a.fullName}?`)) {
                          try {
                            await adminService.deleteAlumni(a.id);
                            load();
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to delete alumni');
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
