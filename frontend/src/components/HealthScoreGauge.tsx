import type { SensorStatus } from '../api/types';

function scoreColor(score: number): string {
  if (score > 70) return 'text-green-500';
  if (score > 40) return 'text-yellow-500';
  return 'text-red-500';
}

function scoreBg(score: number): string {
  if (score > 70) return 'bg-green-500';
  if (score > 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

interface Props {
  status: SensorStatus | null;
}

export default function HealthScoreGauge({ status }: Props) {
  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm text-gray-400">No telemetry data yet</p>
      </div>
    );
  }

  const score = Math.round(status.healthScore);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-4">Health Score</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
            <circle
              cx="60" cy="60" r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={`${(score / 100) * 327} 327`}
              strokeLinecap="round"
              className={scoreColor(score)}
            />
          </svg>
          <span className={`text-3xl font-bold ${scoreColor(score)}`}>{score}</span>
        </div>
        <div className={`mt-3 h-1.5 w-24 rounded-full bg-gray-200 overflow-hidden`}>
          <div className={`h-full rounded-full ${scoreBg(score)}`} style={{ width: `${score}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {new Date(status.calculatedAt).toLocaleString()}
        </p>
      </div>

      {status.alerts.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {status.alerts.map((alert) => (
            <span
              key={alert}
              className="inline-block px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full"
            >
              {alert}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
