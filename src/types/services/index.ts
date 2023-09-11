import moment from "moment-timezone";
import { BalanceTransactionResponse, TransactionStatus, TransactionType } from "../apis";

export interface ResultWithError<T, E> {
  data?: T,
  errors?: E[]
}

export enum DefaultError {
  Unknown = "Unknown"
}

export enum SignInError {
  IncorrectEmailOrPassword = "IncorrectEmailOrPassword",
  InvalidEmail = "InvalidEmail"
}

export enum RegisterError {
  InvalidName = "InvalidName",
  InvalidEmail = "InvalidEmail",
  InvalidPassword = "InvalidPassword",
  EmailExisted = "EmailExisted",
  Unknown = "Unknown",
}

export enum BidError {
  InvalidPrice = "InvalidPrice",
  InsufficientBalance = "InsufficientBalance",
  ExceedTime = "ExceedTime",
  InvalidItem = "InvalidItem"
}

export enum NewItemError {
  InvalidName = "InvalidName",
  Unknown = "Unknown"
}

export enum PublishItemError {
  InvalidPrice = "InvalidPrice",
  InvalidDuration = "InvalidDuration",
  Unknown = "Unknown"
}

export enum DepositError {
  InvalidPrice = "InvalidAmount",
  Unknown = "Unknown"
}

export type DataWithPaging<T> = {
  data: T[],
  noPages: number
}

export type AccountInfo = {
  id: null,
  name: string,
  email: string,
  balance: null,
  lastBidDateTime?: moment.Moment
}

export type MarketItemDto = {
  id: number,
  ownerId: number,
  name: string,
  startPrice: number,
  currentBidPrice: number,
  released: boolean,
  createdDateTime: moment.Moment,
  publishedDateTime: moment.Moment,
  endDateTime: moment.Moment,
  mine: boolean
}

export type ItemStatus = "ongoing" | "end" | "mine";

export enum BidStatus {
  Failed = "Failed",
  Success = "Success"
}

export type ItemBidDto = {
  id: number,
  bidderId: number,
  itemId: number,
  price: number,
  status: BidStatus,
  createdDateTime: moment.Moment
}

export type BalanceTransactionDto = {
  id: number,
  type: TransactionType,
  amount: number,
  status: TransactionStatus,
  transactionDateTime: moment.Moment
}
