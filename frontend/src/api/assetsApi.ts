import apiClient from './apiClient';
import type {
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateTelemetryRequest,
  TelemetryLog,
  SensorStatus,
  PaginatedResponse,
} from './types';

export async function getAssets(
  page = 1,
  pageSize = 20,
  type?: string,
  status?: string
): Promise<PaginatedResponse<Asset>> {
  const params = { page, pageSize, type, status };
  const { data } = await apiClient.get<PaginatedResponse<Asset>>('/api/assets', { params });
  return data;
}

export async function getAssetById(id: string): Promise<Asset> {
  const { data } = await apiClient.get<Asset>(`/api/assets/${id}`);
  return data;
}

export async function createAsset(body: CreateAssetRequest): Promise<Asset> {
  const { data } = await apiClient.post<Asset>('/api/assets', body);
  return data;
}

export async function updateAsset(id: string, body: UpdateAssetRequest): Promise<Asset> {
  const { data } = await apiClient.put<Asset>(`/api/assets/${id}`, body);
  return data;
}

export async function deleteAsset(id: string): Promise<void> {
  await apiClient.delete(`/api/assets/${id}`);
}

export async function postTelemetry(assetId: string, body: CreateTelemetryRequest): Promise<SensorStatus> {
  const { data } = await apiClient.post<SensorStatus>(`/api/assets/${assetId}/telemetry`, body);
  return data;
}

export async function getTelemetry(
  assetId: string,
  page = 1,
  pageSize = 20
): Promise<PaginatedResponse<TelemetryLog>> {
  const params = { page, pageSize };
  const { data } = await apiClient.get<PaginatedResponse<TelemetryLog>>(
    `/api/assets/${assetId}/telemetry`,
    { params }
  );
  return data;
}

export async function getAssetStatus(assetId: string): Promise<SensorStatus> {
  const { data } = await apiClient.get<SensorStatus>(`/api/assets/${assetId}/status`);
  return data;
}
