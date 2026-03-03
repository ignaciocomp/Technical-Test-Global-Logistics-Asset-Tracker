/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTelemetryRequest } from '../models/CreateTelemetryRequest';
import type { PaginatedResponse } from '../models/PaginatedResponse';
import type { SensorStatus } from '../models/SensorStatus';
import type { TelemetryLog } from '../models/TelemetryLog';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TelemetryService {
    /**
     * Ingest a telemetry reading
     * @param id
     * @param requestBody
     * @returns TelemetryLog Telemetry log recorded
     * @throws ApiError
     */
    public static createTelemetryLog(
        id: string,
        requestBody: CreateTelemetryRequest,
    ): CancelablePromise<TelemetryLog> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/assets/{id}/telemetry',
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
     * Get telemetry history for an asset
     * @param id
     * @param page
     * @param pageSize
     * @returns any Paginated telemetry history
     * @throws ApiError
     */
    public static listTelemetryLogs(
        id: string,
        page: number = 1,
        pageSize: number = 20,
    ): CancelablePromise<(PaginatedResponse & {
        items?: Array<TelemetryLog>;
    })> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets/{id}/telemetry',
            path: {
                'id': id,
            },
            query: {
                'page': page,
                'pageSize': pageSize,
            },
            errors: {
                401: `Missing or invalid JWT token`,
                404: `Resource not found`,
                500: `Unexpected server error`,
            },
        });
    }
    /**
     * Get current sensor status and health score
     * @param id
     * @returns SensorStatus Current sensor status
     * @throws ApiError
     */
    public static getSensorStatus(
        id: string,
    ): CancelablePromise<SensorStatus> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/assets/{id}/status',
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
