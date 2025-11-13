import { useEffect, useState } from 'react';
import { alumniService } from '../../services/alumni';

export default function AlumniProfile() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError(null);
      const data = await alumniService.getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
      console.error('Profile error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await alumniService.updateMyProfile({
        phone: profile.phone,
        currentJobTitle: profile.currentJobTitle,
        currentCompany: profile.currentCompany,
        employmentStatus: profile.employmentStatus,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-lg font-semibold">Profile Not Found</div>
          <p className="text-gray-600 mb-4">
            Your profile was not found. This usually happens if your account was created without completing the registration process.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <p className="text-sm text-yellow-800 mb-2">
              <strong>To create your profile:</strong>
            </p>
            <ol className="text-sm text-yellow-800 list-decimal list-inside space-y-1">
              <li>Log out and register again with all required information</li>
              <li>Or contact an administrator to create your profile</li>
            </ol>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={loadProfile}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'EMPLOYED': return 'bg-green-100 text-green-800';
      case 'UNEMPLOYED': return 'bg-red-100 text-red-800';
      case 'SEARCHING': return 'bg-yellow-100 text-yellow-800';
      case 'FREELANCE': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">My Profile & Tracking</h2>
        
        {/* Status Card */}
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Profile Status</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${profile.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {profile.isApproved ? '✓ Approved' : '⏳ Pending Approval'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Employment Status</div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getStatusColor(profile.employmentStatus)}`}>
                {profile.employmentStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Read-only Information */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Full Name</label>
              <input className="w-full border p-2 rounded bg-gray-50" readOnly value={profile.fullName} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Major</label>
              <input className="w-full border p-2 rounded bg-gray-50" readOnly value={profile.major} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Graduation Year</label>
              <input className="w-full border p-2 rounded bg-gray-50" readOnly value={profile.graduationYear} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">School</label>
              <input className="w-full border p-2 rounded bg-gray-50" readOnly value={profile.school?.name || 'N/A'} />
            </div>
          </div>
        </div>

        {/* Editable Information */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Update Your Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="Phone"
                value={profile.phone || ''}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Current Job Title</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="Current Job Title"
                value={profile.currentJobTitle || ''}
                onChange={e => setProfile({ ...profile, currentJobTitle: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Current Company</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="Current Company"
                value={profile.currentCompany || ''}
                onChange={e => setProfile({ ...profile, currentCompany: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Employment Status</label>
              <select
                className="w-full border p-2 rounded"
                value={profile.employmentStatus}
                onChange={e => setProfile({ ...profile, employmentStatus: e.target.value })}
              >
                <option value="EMPLOYED">Employed</option>
                <option value="UNEMPLOYED">Unemployed</option>
                <option value="SEARCHING">Searching</option>
                <option value="FREELANCE">Freelance</option>
              </select>
            </div>
          </div>
        </div>

        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">Profile updated successfully!</div>}

        <button
          onClick={save}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tracking Summary Card */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Your Tracking Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-600">Graduation Year</div>
            <div className="text-xl font-semibold">{profile.graduationYear}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-600">Major</div>
            <div className="text-xl font-semibold">{profile.major}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
