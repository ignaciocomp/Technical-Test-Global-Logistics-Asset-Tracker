export type {
  Asset,
  AssetType,
  AssetStatus,
  Location,
  Sensors,
  TelemetryLog,
  SensorStatus,
  CreateAssetRequest,
  UpdateAssetRequest,
  CreateTelemetryRequest,
} from './generated';

export { AssetType as AssetTypeEnum, AssetStatus as AssetStatusEnum } from './generated';

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
