import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Vehicle } from "../types/vehicle";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type VehiclesRequest = {
  page: number;
  limit: number;
  filters?: {};
  sort?: Array<{
    orderBy: keyof Vehicle;
    order: SortEnum;
  }>;
};

export type VehiclesResponse = InfinityPaginationType<Vehicle>;

export function useGetVehiclesService() {
  const fetch = useFetch();

  return useCallback(
    (data: VehiclesRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/vehicles`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VehiclesResponse>);
    },
    [fetch]
  );
}

export type VehicleRequest = {
  id: Vehicle["id"];
};

export type VehicleResponse = Vehicle;

export function useGetVehicleService() {
  const fetch = useFetch();

  return useCallback(
    (data: VehicleRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vehicles/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VehicleResponse>);
    },
    [fetch]
  );
}

export type VehiclePostRequest = Pick<Vehicle, "name" | "channel">;

export type VehiclePostResponse = Vehicle;

export function usePostVehicleService() {
  const fetch = useFetch();

  return useCallback(
    (data: VehiclePostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vehicles`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VehiclePostResponse>);
    },
    [fetch]
  );
}

export type VehiclePatchRequest = {
  id: Vehicle["id"];
  data: Partial<Pick<Vehicle, "name" | "channel">>;
};

export type VehiclePatchResponse = Vehicle;

export function usePatchVehicleService() {
  const fetch = useFetch();

  return useCallback(
    (data: VehiclePatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vehicles/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VehiclePatchResponse>);
    },
    [fetch]
  );
}

export type VehicleDeleteRequest = {
  id: Vehicle["id"];
};

export type VehicleDeleteResponse = undefined;

export function useDeleteVehicleService() {
  const fetch = useFetch();

  return useCallback(
    (data: VehicleDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/vehicles/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<VehicleDeleteResponse>);
    },
    [fetch]
  );
}
