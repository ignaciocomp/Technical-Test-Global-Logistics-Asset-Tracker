import { useState, type FormEvent } from 'react';
import * as assetsApi from '../api/assetsApi';

interface Props {
  assetId: string;
  onClose: () => void;
  onSubmitted: () => void;
}

export default function TelemetryModal({ assetId, onClose, onSubmitted }: Props) {
  const [temperature, setTemperature] = useState('25');
  const [pressure, setPressure] = useState('85');
  const [vibration, setVibration] = useState('10');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await assetsApi.postTelemetry(assetId, {
        sensors: {
          temperature: parseFloat(temperature),
          pressure: parseFloat(pressure),
          vibration: parseFloat(vibration),
        },
      });
      onSubmitted();
    } catch {
      setError('Failed to send telemetry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Send Telemetry</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="any"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pressure (units)</label>
            <input
              type="number"
              step="any"
              value={pressure}
              onChange={(e) => setPressure(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vibration (units)</label>
            <input
              type="number"
              step="any"
              value={vibration}
              onChange={(e) => setVibration(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border text-sm rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
