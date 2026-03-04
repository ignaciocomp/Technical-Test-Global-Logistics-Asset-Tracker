import { useEffect, useState } from 'react';
import { useAssetStore } from '../store/useAssetStore';
import type { Asset } from '../api/types';
import AssetFormModal from '../components/AssetFormModal';

const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  inactive: 'bg-gray-100 text-gray-500',
};

export default function AssetsPage() {
  const { assets, totalCount, page, isLoading, fetchAssets } = useAssetStore();
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Asset | null>(null);

  useEffect(() => {
    fetchAssets(1);
  }, [fetchAssets]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (asset: Asset) => {
    setEditing(asset);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSaved = () => {
    closeModal();
    fetchAssets(page);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Assets</h2>
          <p className="text-sm text-gray-500">{totalCount} total assets</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          + New Asset
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs tracking-wider">
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Last Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
            {!isLoading && assets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  No assets found. Create your first one.
                </td>
              </tr>
            )}
            {!isLoading &&
              assets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => openEdit(asset)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{asset.name}</td>
                  <td className="px-6 py-4 text-gray-600 capitalize">{asset.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        statusColor[asset.status ?? ''] ?? 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {asset.location
                      ? `${asset.location.latitude?.toFixed(4)}, ${asset.location.longitude?.toFixed(4)}`
                      : '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {asset.lastUpdated ? new Date(asset.lastUpdated).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => fetchAssets(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => fetchAssets(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 border rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {modalOpen && <AssetFormModal asset={editing} onClose={closeModal} onSaved={handleSaved} />}
    </div>
  );
}
