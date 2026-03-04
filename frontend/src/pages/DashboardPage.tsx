import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAssetStore } from '../store/useAssetStore';

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-500',
};

export default function DashboardPage() {
  const { assets, totalCount, fetchAssets } = useAssetStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  const statusCounts = useMemo(() => {
    const counts = { active: 0, maintenance: 0, inactive: 0 };
    assets.forEach((a) => {
      const s = a.status?.toLowerCase() as keyof typeof counts;
      if (s in counts) counts[s]++;
    });
    return counts;
  }, [assets]);

  const typeData = useMemo(() => {
    const counts: Record<string, number> = {};
    assets.forEach((a) => {
      const t = a.type ?? 'unknown';
      counts[t] = (counts[t] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [assets]);

  const recentAssets = useMemo(
    () =>
      [...assets]
        .sort((a, b) => {
          const da = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
          const db = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
          return db - da;
        })
        .slice(0, 5),
    [assets]
  );

  const statCards = [
    { label: 'Total Assets', value: totalCount, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active', value: statusCounts.active, color: 'bg-green-50 text-green-700' },
    { label: 'Maintenance', value: statusCounts.maintenance, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Inactive', value: statusCounts.inactive, color: 'bg-gray-50 text-gray-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-5">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className={`text-2xl font-bold ${card.color} inline-block px-2 py-0.5 rounded`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-4">Assets by Type</h3>
          {typeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} className="capitalize" />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">No assets yet</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-sm font-medium text-gray-500">Recently Updated</h3>
          </div>
          {recentAssets.length > 0 ? (
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {recentAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-gray-800">{asset.name}</td>
                    <td className="px-6 py-3 text-gray-600 capitalize">{asset.type}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusColor[asset.status ?? ''] ?? 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">
                      {asset.lastUpdated ? new Date(asset.lastUpdated).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-400 text-center py-12">No assets yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
