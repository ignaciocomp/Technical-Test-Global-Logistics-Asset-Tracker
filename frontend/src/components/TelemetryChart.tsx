import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { TelemetryLog } from '../api/types';

interface Props {
  logs: TelemetryLog[];
}

export default function TelemetryChart({ logs }: Props) {
  if (logs.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm text-gray-400">No telemetry readings to chart</p>
      </div>
    );
  }

  const data = [...logs]
    .reverse()
    .map((log) => ({
      time: new Date(log.timestamp).toLocaleTimeString(),
      Temperature: log.sensors.temperature,
      Pressure: log.sensors.pressure,
      Vibration: log.sensors.vibration,
    }));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Telemetry History</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Pressure" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="Vibration" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
