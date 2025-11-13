import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

export default function ManageSchools() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const r = await adminService.listSchools();
      setRows(r);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load schools');
      console.error('Load schools error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addSchool(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert('School name is required');
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      await adminService.createSchool({ name, description, contactPerson });
      setName('');
      setDescription('');
      setContactPerson('');
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create school');
      alert(err.response?.data?.message || 'Failed to create school');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center text-gray-500">Loading schools data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="mb-4">
        <h2 className="font-semibold mb-1">Manage Schools</h2>
        <p className="text-sm text-gray-500">Total: {rows.length} schools</p>
      </div>
      
      <form className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-4 bg-gray-50 rounded" onSubmit={addSchool}>
        <input
          className="border p-2 rounded"
          placeholder="School Name *"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          className="border p-2 rounded"
          placeholder="Contact Person"
          value={contactPerson}
          onChange={e => setContactPerson(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700 disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? 'Adding...' : 'Add School'}
        </button>
      </form>

      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}

      <div className="overflow-x-auto">
        {rows.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No schools registered yet</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Description</th>
                <th className="p-2">Contact</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(s => (
                <tr key={s.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{s.name}</td>
                  <td className="p-2">{s.description || 'N/A'}</td>
                  <td className="p-2">{s.contactPerson || 'N/A'}</td>
                  <td className="p-2">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                      onClick={async () => {
                        if (confirm(`Are you sure you want to delete ${s.name}?`)) {
                          try {
                            await adminService.deleteSchool(s.id);
                            load();
                          } catch (err) {
                            alert(err.response?.data?.message || 'Failed to delete school');
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
