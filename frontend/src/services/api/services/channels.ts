import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { Channel } from "../types/channel";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { SortEnum } from "../types/sort-type";
import { RequestConfigType } from "./types/request-config";

export type ChannelsRequest = {
  page: number;
  limit: number;
  filters?: {};
  sort?: Array<{
    orderBy: keyof Channel;
    order: SortEnum;
  }>;
};

export type ChannelsResponse = InfinityPaginationType<Channel>;

export function useGetChannelsService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/channels`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());
      if (data.sort) {
        requestUrl.searchParams.append("sort", JSON.stringify(data.sort));
      }

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelsResponse>);
    },
    [fetch]
  );
}

export type ChannelRequest = {
  id: Channel["id"];
};

export type ChannelResponse = Channel;

export function useGetChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/channels/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelResponse>);
    },
    [fetch]
  );
}

export type ChannelPostRequest = Pick<Channel, "name">;

export type ChannelPostResponse = Channel;

export function usePostChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelPostRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelPostResponse>);
    },
    [fetch]
  );
}

export type ChannelPatchRequest = {
  id: Channel["id"];
  data: Partial<Pick<Channel, "name">>;
};

export type ChannelPatchResponse = Channel;

export function usePatchChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelPatchRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelPatchResponse>);
    },
    [fetch]
  );
}

export type ChannelDeleteRequest = {
  id: Channel["id"];
};

export type ChannelDeleteResponse = undefined;

export function useDeleteChannelService() {
  const fetch = useFetch();

  return useCallback(
    (data: ChannelDeleteRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/channels/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<ChannelDeleteResponse>);
    },
    [fetch]
  );
}
