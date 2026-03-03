/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AssetStatus } from './AssetStatus';
import type { AssetType } from './AssetType';
import type { Location } from './Location';
export type Asset = {
    id: string;
    name: string;
    type: AssetType;
    status: AssetStatus;
    location: Location;
    lastUpdated: string;
};

