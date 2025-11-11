import { useEffect, useState } from 'react';
import { schoolService } from '../services/school';

export default function SchoolAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    schoolService.analytics().then(setData).catch(() => setData({ employmentRate: 0, avgSalary: null, topSectors: [] }));
  }, []);

  if (!data) return <div>Loading analytics...</div>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">School Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Employment Rate</div>
          <div className="text-2xl font-bold">{data.employmentRate}%</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Avg Salary</div>
          <div className="text-2xl font-bold">{data.avgSalary ?? 'N/A'}</div>
        </div>
        <div className="p-3 border rounded">
          <div className="text-sm text-gray-500">Top Sectors</div>
          <ul className="list-disc ml-5">
            {data.topSectors?.map(s => (
              <li key={s.name}>{s.name}: {s.count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
