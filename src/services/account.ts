import {
  AccountInfo,
  BalanceTransactionDto,
  BidError,
  BidStatus,
  DefaultError,
  DepositError,
  ResultWithError
} from "types/services";

import { updateAccountInfo } from "model/user-account";
import { depositApi, newItemBidApi, retrieveAccountInfoApi } from "apis";
import moment from "moment-timezone";
import { ApiErrorCode, ApiResponse, ItemBidResponse, TransactionStatus } from "../types/apis";

export const getAccountInfo = async (): Promise<ResultWithError<AccountInfo, DefaultError>> => {
  const {
    data,
    errorCode
  } = await retrieveAccountInfoApi();

  if (!errorCode) {
    const {
      id,
      fullName,
      balance,
      email,
      lastBidDateTime
    } = data;

    await updateAccountInfo(fullName, balance);
    return {
      data: {
        id,
        name: fullName,
        email,
        balance,
        lastBidDateTime: lastBidDateTime ? moment(lastBidDateTime) : null
      }
    };
  } else {
    return { errors: [DefaultError.Unknown] }
  }
}

export const depositToBalance = async (
  amount: number
): Promise<ResultWithError<BalanceTransactionDto, DepositError>> => {
  if (isNaN(amount)) return { errors: [DepositError.InvalidPrice] };

  const {
    data,
    errorCode
  }: ApiResponse<BalanceTransactionDto> = await depositApi(amount * 100);

  if (!!errorCode) {
    switch (errorCode) {
      case ApiErrorCode.INVALID_DATA:
        return { errors: [DepositError.InvalidPrice] };
      default:
        return { errors: [DepositError.Unknown] };
    }
  } else {
    const {
      id,
      type,
      amount,
      status,
      transactionDateTime
    } = data;

    if (status === TransactionStatus.Failed)
      return { errors: [DepositError.Unknown] };

    return {
      data: {
        id,
        type,
        amount,
        status,
        transactionDateTime: moment(transactionDateTime)
      }
    }
  }
}
