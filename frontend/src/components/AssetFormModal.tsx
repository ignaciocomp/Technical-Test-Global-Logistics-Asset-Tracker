import { useState, type FormEvent } from 'react';
import type { Asset } from '../api/types';
import { AssetTypeEnum, AssetStatusEnum } from '../api/types';
import * as assetsApi from '../api/assetsApi';

interface Props {
  asset: Asset | null;
  onClose: () => void;
  onSaved: () => void;
}

const TYPES = [
  { value: AssetTypeEnum.CONTAINER, label: 'Container' },
  { value: AssetTypeEnum.VEHICLE, label: 'Vehicle' },
  { value: AssetTypeEnum.MACHINERY, label: 'Machinery' },
];

const STATUSES = [
  { value: AssetStatusEnum.ACTIVE, label: 'Active' },
  { value: AssetStatusEnum.MAINTENANCE, label: 'Maintenance' },
  { value: AssetStatusEnum.INACTIVE, label: 'Inactive' },
];

export default function AssetFormModal({ asset, onClose, onSaved }: Props) {
  const isEdit = !!asset;

  const [name, setName] = useState(asset?.name ?? '');
  const [type, setType] = useState<AssetTypeEnum>(asset?.type ?? AssetTypeEnum.CONTAINER);
  const [status, setStatus] = useState<AssetStatusEnum>(asset?.status ?? AssetStatusEnum.ACTIVE);
  const [latitude, setLatitude] = useState(asset?.location?.latitude?.toString() ?? '');
  const [longitude, setLongitude] = useState(asset?.location?.longitude?.toString() ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const location = {
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
      };

      if (isEdit) {
        await assetsApi.updateAsset(asset.id, { name, status, location });
      } else {
        await assetsApi.createAsset({ name, type, status, location });
      }
      onSaved();
    } catch {
      setError('Failed to save asset.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!asset) return;
    setError('');
    setDeleting(true);
    try {
      await assetsApi.deleteAsset(asset.id);
      onSaved();
    } catch {
      setError('Failed to delete asset.');
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {isEdit ? 'Edit Asset' : 'New Asset'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssetTypeEnum)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatusEnum)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="-90 to 90"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="-180 to 180"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">{error}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            {isEdit ? (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Are you sure?</span>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Yes, delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 border text-sm rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete asset
                </button>
              )
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border text-sm rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
