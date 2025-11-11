import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

export default function ManageSchools() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');

  async function load() { const r = await adminService.listSchools(); setRows(r); }
  useEffect(() => { load(); }, []);

  async function addSchool(e) {
    e.preventDefault();
    await adminService.createSchool({ name, description, contactPerson });
    setName(''); setDescription(''); setContactPerson('');
    load();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Manage Schools</h2>
      <form className="flex gap-2 mb-4" onSubmit={addSchool}>
        <input className="border p-2 rounded" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Contact Person" value={contactPerson} onChange={e => setContactPerson(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 rounded">Add</button>
      </form>

      <div className="overflow-x-auto">
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
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">{s.contactPerson}</td>
                <td className="p-2">
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={async () => { await adminService.deleteSchool(s.id); load(); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
