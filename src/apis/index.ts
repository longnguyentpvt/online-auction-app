import apiCall from "./utils";

import {
  AccountInfoResponse,
  ApiRequest,
  ApiResponse,
  AuthCredentialResponse, BalanceTransactionResponse, ItemBidResponse, ItemsListingResponse, MarketItemApiResponse
} from "types/apis";

export const authenticateCredentialApi = async (
  username: string,
  password: string
): Promise<ApiResponse<AuthCredentialResponse>> => {
  const requestBody = {
    username,
    password
  };

  const request: ApiRequest = {
    url: "/authenticate/account",
    method: "POST",
    data: requestBody,
    authToken: false
  };
  return await apiCall<AuthCredentialResponse>(request);
};

export const retrieveAccountInfoApi = async (): Promise<ApiResponse<AccountInfoResponse>> => {
  const request: ApiRequest = {
    url: "/user/account/info",
    method: "GET",
    authToken: true
  };
  return await apiCall<AccountInfoResponse>(request);
};

export const retrieveListItemsApi = async (
  owner: "me" | null,
  page: number,
  noRecords: number,
  filterStatus: "ongoing" | "end" | null
): Promise<ApiResponse<ItemsListingResponse>> => {
  const request: ApiRequest = {
    url: "/market/items/list",
    method: "GET",
    params: {
      owner,
      page,
      noRecords,
      filterStatus
    },
    authToken: true
  };
  return await apiCall<ItemsListingResponse>(request);
}

export const newMarketItemApi = async (name: string): Promise<ApiResponse<MarketItemApiResponse>> => {
  const requestBody = { name };

  const request: ApiRequest = {
    url: "/market/items/new",
    method: "POST",
    data: requestBody,
    authToken: true
  };
  return await apiCall<MarketItemApiResponse>(request);
};

export const publishMarketItemApi = async (itemId: number, startPrice: number, duration: number):
  Promise<ApiResponse<MarketItemApiResponse>> => {
  const requestBody = {
    itemId,
    startPrice,
    duration
  };

  const request: ApiRequest = {
    url: "/market/items/publish",
    method: "PUT",
    data: requestBody,
    authToken: true
  };
  return await apiCall<MarketItemApiResponse>(request);
};

export const newItemBidApi = async (
  itemId: number,
  price: number
): Promise<ApiResponse<ItemBidResponse>> => {
  const requestBody = {
    itemId,
    price
  };

  const request: ApiRequest = {
    url: "/market/item/bid/new",
    method: "POST",
    data: requestBody,
    authToken: true
  };
  return await apiCall<ItemBidResponse>(request);
};

export const depositApi = async (
  amount: number
): Promise<ApiResponse<BalanceTransactionResponse>> => {
  const requestBody = {
    amount
  };

  const request: ApiRequest = {
    url: "/account/balance/deposit",
    method: "POST",
    data: requestBody,
    authToken: true
  };
  return await apiCall<BalanceTransactionResponse>(request);
};
