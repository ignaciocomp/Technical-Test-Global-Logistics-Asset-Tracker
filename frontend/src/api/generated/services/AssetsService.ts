/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Asset } from '../models/Asset';
import type { AssetStatus } from '../models/AssetStatus';
import type { AssetType } from '../models/AssetType';
import type { CreateAssetRequest } from '../models/CreateAssetRequest';
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { UpdateAssetRequest } from '../models/UpdateAssetRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AssetsService {
    /**
     * List all assets
     * @param page
     * @param pageSize
     * @param type
     * @param status
     * @returns any Paginated list of assets
     * @throws ApiError
     */
    public static listAssets(
        page: number = 1,
        pageSize: number = 20,
        type?: AssetType,
        status?: AssetStatus,
    ): CancelablePromise<(PaginatedResponse & {
        items?: Array<Asset>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets',
            query: {
                'page': page,
                'pageSize': pageSize,
                'type': type,
                'status': status,
            },
            errors: {
                401: `Missing or invalid JWT token`,
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Create a new asset
     * @param requestBody
     * @returns Asset Asset created
     * @throws ApiError
     */
    public static createAsset(
        requestBody: CreateAssetRequest,
    ): CancelablePromise<Asset> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/assets',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Missing or invalid JWT token`,
                409: `Resource already exists`,
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Get asset by ID
     * @param id
     * @returns Asset Asset details
     * @throws ApiError
     */
    public static getAsset(
        id: string,
    ): CancelablePromise<Asset> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Missing or invalid JWT token`,
                404: `Resource not found`,
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Update an existing asset
     * @param id
     * @param requestBody
     * @returns Asset Updated asset
     * @throws ApiError
     */
    public static updateAsset(
        id: string,
        requestBody: UpdateAssetRequest,
    ): CancelablePromise<Asset> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Missing or invalid JWT token`,
                404: `Resource not found`,
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Delete an asset
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteAsset(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/assets/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Missing or invalid JWT token`,
                404: `Resource not found`,
                500: `Unexpected server error`,
            },
        });
    }
}
