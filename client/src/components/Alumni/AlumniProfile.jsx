import { useEffect, useState } from 'react';
import { alumniService } from '../../services/alumni';

export default function AlumniProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    alumniService.getMyProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  if (!profile) return <div>Loading profile...</div>;

  async function save() {
    setSaving(true);
    try {
      await alumniService.updateMyProfile({
        phone: profile.phone,
        currentJobTitle: profile.currentJobTitle,
        currentCompany: profile.currentCompany,
        employmentStatus: profile.employmentStatus,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">My Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="border p-2 rounded" readOnly value={profile.fullName} />
        <input className="border p-2 rounded" readOnly value={profile.major} />
        <input className="border p-2 rounded" readOnly value={profile.graduationYear} />
        <input className="border p-2 rounded" placeholder="Phone" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Current Job Title" value={profile.currentJobTitle || ''} onChange={e => setProfile({ ...profile, currentJobTitle: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Current Company" value={profile.currentCompany || ''} onChange={e => setProfile({ ...profile, currentCompany: e.target.value })} />
        <select className="border p-2 rounded" value={profile.employmentStatus} onChange={e => setProfile({ ...profile, employmentStatus: e.target.value })}>
          <option value="EMPLOYED">Employed</option>
          <option value="UNEMPLOYED">Unemployed</option>
          <option value="SEARCHING">Searching</option>
          <option value="FREELANCE">Freelance</option>
        </select>
      </div>
      <button onClick={save} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
    </div>
  );
}
