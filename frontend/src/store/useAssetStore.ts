import { create } from 'zustand';
import type { Asset, SensorStatus, TelemetryLog } from '../api/types';
import * as assetsApi from '../api/assetsApi';

interface AssetState {
  assets: Asset[];
  totalCount: number;
  page: number;
  selectedAsset: Asset | null;
  sensorStatus: SensorStatus | null;
  telemetryLogs: TelemetryLog[];
  isLoading: boolean;

  fetchAssets: (page?: number, type?: string, status?: string) => Promise<void>;
  selectAsset: (asset: Asset) => Promise<void>;
  clearSelection: () => void;
  refreshStatus: (assetId: string) => Promise<void>;
  refreshTelemetry: (assetId: string) => Promise<void>;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  totalCount: 0,
  page: 1,
  selectedAsset: null,
  sensorStatus: null,
  telemetryLogs: [],
  isLoading: false,

  fetchAssets: async (page = 1, type?: string, status?: string) => {
    set({ isLoading: true });
    try {
      const result = await assetsApi.getAssets(page, 20, type, status);
      set({ assets: result.items, totalCount: result.totalCount, page });
    } finally {
      set({ isLoading: false });
    }
  },

  selectAsset: async (asset) => {
    set({ selectedAsset: asset, sensorStatus: null, telemetryLogs: [] });
    try {
      const [status, telemetry] = await Promise.allSettled([
        assetsApi.getAssetStatus(asset.id),
        assetsApi.getTelemetry(asset.id, 1, 10),
      ]);
      set({
        sensorStatus: status.status === 'fulfilled' ? status.value : null,
        telemetryLogs: telemetry.status === 'fulfilled' ? telemetry.value.items : [],
      });
    } catch {
      /* asset might have no telemetry yet */
    }
  },

  clearSelection: () => {
    set({ selectedAsset: null, sensorStatus: null, telemetryLogs: [] });
  },

  refreshStatus: async (assetId) => {
    try {
      const status = await assetsApi.getAssetStatus(assetId);
      set({ sensorStatus: status });
    } catch {
      /* no telemetry data */
    }
  },

  refreshTelemetry: async (assetId) => {
    try {
      const result = await assetsApi.getTelemetry(assetId, 1, 10);
      set({ telemetryLogs: result.items });
    } catch {
      /* no telemetry data */
    }
  },
}));
