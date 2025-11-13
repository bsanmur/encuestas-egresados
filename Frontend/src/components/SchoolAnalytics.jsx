import { useEffect, useState } from "react";
import { schoolService } from "../services/school";

export default function SchoolAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      setLoading(true);
      setError(null);
      const analytics = await schoolService.analytics();
      setData(analytics);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics");
      console.error("Analytics error:", err);
      setData({ employmentRate: 0, avgSalary: null, topSectors: [] });
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
        <div className="text-red-600 mb-2">Error: {error}</div>
        <button
          onClick={loadAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Calculate total alumni from top sectors
  const totalAlumni =
    data.topSectors?.reduce((sum, sector) => sum + sector.count, 0) || 0;

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">School Tracking Analytics</h2>
          <button
            onClick={loadAnalytics}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg bg-green-50">
            <div className="text-sm text-gray-600 mb-1">Employment Rate</div>
            <div className="text-3xl font-bold text-green-600">
              {data.employmentRate}%
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Alumni employment status
            </div>
          </div>
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="text-sm text-gray-600 mb-1">Average Salary</div>
            <div className="text-3xl font-bold text-blue-600">
              {data.avgSalary ?? "N/A"}
            </div>
            <div className="text-xs text-gray-500 mt-1">Not available yet</div>
          </div>
          <div className="p-4 border rounded-lg bg-purple-50">
            <div className="text-sm text-gray-600 mb-1">Active Sectors</div>
            <div className="text-3xl font-bold text-purple-600">
              {data.topSectors?.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Top programs tracked
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Top Sectors by Alumni Count
        </h3>
        {data.topSectors && data.topSectors.length > 0 ? (
          <div className="space-y-3">
            {data.topSectors.map((sector, index) => (
              <div
                key={sector.name}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{sector.name}</div>
                    <div className="text-sm text-gray-500">
                      {sector.count} alumni
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {totalAlumni > 0
                      ? Math.round((sector.count / totalAlumni) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            No sector data available for your school
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Tracking Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-600">Total Alumni Tracked</div>
            <div className="text-xl font-semibold">{totalAlumni}</div>
          </div>
          <div className="p-3 border rounded">
            <div className="text-sm text-gray-600">Employment Rate</div>
            <div className="text-xl font-semibold">{data.employmentRate}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
