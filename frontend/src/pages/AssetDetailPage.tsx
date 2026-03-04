import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as assetsApi from '../api/assetsApi';
import { useAssetStore } from '../store/useAssetStore';
import type { Asset } from '../api/types';
import HealthScoreGauge from '../components/HealthScoreGauge';
import TelemetryChart from '../components/TelemetryChart';
import TelemetryModal from '../components/TelemetryModal';

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-500',
};

const AUTO_REFRESH_MS = 30_000;

export default function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { sensorStatus, telemetryLogs, refreshStatus, refreshTelemetry } = useAssetStore();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [telemetryOpen, setTelemetryOpen] = useState(false);

  const loadAsset = useCallback(async () => {
    if (!id) return;
    try {
      const data = await assetsApi.getAssetById(id);
      setAsset(data);
    } catch {
      navigate('/assets');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const refreshAll = useCallback(() => {
    if (!id) return;
    refreshStatus(id);
    refreshTelemetry(id);
  }, [id, refreshStatus, refreshTelemetry]);

  useEffect(() => {
    loadAsset();
    refreshAll();
  }, [loadAsset, refreshAll]);

  useEffect(() => {
    const interval = setInterval(refreshAll, AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [refreshAll]);

  const handleTelemetrySubmitted = () => {
    setTelemetryOpen(false);
    refreshAll();
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400">Loading...</div>
    );
  }

  if (!asset || !id) return null;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/assets')}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">{asset.name}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span className="capitalize">{asset.type}</span>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                statusColor[asset.status ?? ''] ?? 'bg-gray-100 text-gray-500'
              }`}
            >
              {asset.status}
            </span>
            {asset.location && (
              <span>
                {asset.location.latitude?.toFixed(4)}, {asset.location.longitude?.toFixed(4)}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => setTelemetryOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + Post Telemetry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthScoreGauge status={sensorStatus} />
        </div>
        <div className="lg:col-span-2">
          <TelemetryChart logs={telemetryLogs} />
        </div>
      </div>

      {telemetryLogs.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-sm font-medium text-gray-500">Recent Readings</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Temperature</th>
                <th className="px-6 py-3">Pressure</th>
                <th className="px-6 py-3">Vibration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {telemetryLogs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-3 text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 text-gray-800">{log.sensors.temperature.toFixed(1)}°C</td>
                  <td className="px-6 py-3 text-gray-800">{log.sensors.pressure.toFixed(1)}</td>
                  <td className="px-6 py-3 text-gray-800">{log.sensors.vibration.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {telemetryOpen && (
        <TelemetryModal
          assetId={id}
          onClose={() => setTelemetryOpen(false)}
          onSubmitted={handleTelemetrySubmitted}
        />
      )}
    </div>
  );
}
