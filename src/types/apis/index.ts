import { Method } from "axios";
import moment from "moment-timezone";
import { BidStatus } from "../services";

export type ApiRequest = {
  url: string,
  method: Method,
  params?: Record<string, unknown>,
  data?: Record<string, unknown> | FormData,
  extraHeaders?: Record<string, unknown>,
  authToken?: boolean,
  timeout?: number,
  download?: boolean
}

export type ApiResponse<T> = {
  success: boolean,
  data: T,
  errorCode: ApiErrorCode,
  errorMsg?: string
}

export enum ApiErrorCode {
  SYSTEM_ERROR = "SYSTEM_ERROR",
  UNKNOWN = "UNKNOWN",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_DATA = "INVALID_DATA",
  INACTIVE = "INACTIVE",
  DISABLED_ACCESS = "DISABLED_ACCESS",
  EXISTED = "EXISTED",
  NOT_FOUND = "NOT_FOUND",
  OVER_LIMIT = "OVER_LIMIT",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE"
}

export type AuthCredentialResponse = {
  id: number,
  fullName: string,
  email: string,
  accessToken: string,
  tokenExpiry: string
}

export type AccountInfoResponse = {
  id: null,
  fullName: string,
  email: string,
  balance: null,
  lastBidDateTime: string
}

export type MarketItemApiResponse = {
  id: number,
  ownerId: number,
  name: string,
  startPrice: number,
  currentBidPrice: number,
  released: boolean,
  createdDateTime: string,
  publishedDateTime: string,
  endDateTime: string
}

export type ItemsListingResponse = {
  items: MarketItemApiResponse[],
  count: number
}

export type ItemBidResponse = {
  id: number,
  bidderId: number,
  itemId: number,
  price: number,
  status: BidStatus,
  createdDateTime : string
}

export enum TransactionType {
  Withdrawn = "Withdrawn",
  Deposit = "Deposit",
  TransferIn = "TransferIn",
  Bid = "Bid"
}

export enum TransactionStatus {
  Failed = "Failed",
  Success = "Success"
}

export type BalanceTransactionResponse = {
  id: number,
  type: TransactionType,
  amount: number,
  status: TransactionStatus,
  transactionDateTime : string
}
