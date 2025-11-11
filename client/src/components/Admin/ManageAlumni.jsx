import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

export default function ManageAlumni() {
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');

  async function load() { const r = await adminService.listAlumni(); setRows(r); }
  useEffect(() => { load(); }, []);

  const filtered = rows.filter(r => r.fullName.toLowerCase().includes(query.toLowerCase()) || r.user.email.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold">Manage Alumni</h2>
        <input className="border p-2 rounded" placeholder="Search" value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Major</th>
              <th className="p-2">Graduation</th>
              <th className="p-2">School</th>
              <th className="p-2">Approved</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id} className="border-b">
                <td className="p-2">{a.fullName}</td>
                <td className="p-2">{a.user.email}</td>
                <td className="p-2">{a.major}</td>
                <td className="p-2">{a.graduationYear}</td>
                <td className="p-2">{a.school?.name}</td>
                <td className="p-2">{a.isApproved ? 'Yes' : 'No'}</td>
                <td className="p-2 flex gap-2">
                  {!a.isApproved && <button className="px-2 py-1 bg-green-600 text-white rounded" onClick={async () => { await adminService.approveAlumni(a.id); load(); }}>Approve</button>}
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={async () => { await adminService.deleteAlumni(a.id); load(); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
