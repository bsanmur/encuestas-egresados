import { useEffect, useState } from 'react';
import { adminService } from '../../services/admin';

export default function GlobalAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.globalAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-center text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="text-red-600">Error: {error}</div>
        <button
          onClick={loadAnalytics}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Global Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="text-sm text-gray-600 mb-1">Total Alumni</div>
            <div className="text-3xl font-bold text-blue-600">{analytics.totalAlumni || 0}</div>
          </div>
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="text-sm text-gray-600 mb-1">Employment Rate</div>
            <div className="text-3xl font-bold text-green-600">{analytics.employmentRate}%</div>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50">
            <div className="text-sm text-gray-600 mb-1">Top Sectors</div>
            <div className="text-2xl font-bold text-purple-600">{analytics.topSectors?.length || 0}</div>
            <div className="text-xs text-gray-500 mt-1">Active sectors</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Top Sectors by Alumni Count</h3>
        {analytics.topSectors && analytics.topSectors.length > 0 ? (
          <div className="space-y-3">
            {analytics.topSectors.map((sector, index) => (
              <div key={sector.name} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{sector.name}</div>
                    <div className="text-sm text-gray-500">{sector.count} alumni</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {analytics.totalAlumni > 0
                      ? Math.round((sector.count / analytics.totalAlumni) * 100)
                      : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">No sector data available</div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <button
            onClick={loadAnalytics}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Total Alumni Tracked</div>
            <div className="text-lg font-semibold">{analytics.totalAlumni}</div>
          </div>
          <div>
            <div className="text-gray-600">Employment Rate</div>
            <div className="text-lg font-semibold">{analytics.employmentRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}

