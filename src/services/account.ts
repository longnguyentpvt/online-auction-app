import {
  AccountInfo,
  BalanceTransactionDto,
  DefaultError,
  DepositError,
  RegisterError,
  ResultWithError
} from "types/services";

import { updateAccountInfo } from "model/user-account";
import { createAccountApi, depositApi, retrieveAccountInfoApi } from "apis";
import moment from "moment-timezone";
import { ApiErrorCode, ApiResponse, TransactionStatus } from "../types/apis";
import { validateEmail } from "../utils/validation";

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

export const registerAccount = async (name: string, email: string, password: string):
  Promise<ResultWithError<AccountInfo, RegisterError>> => {
  let errors: RegisterError[] = [];
  let result: AccountInfo = null;

  // validate inputs
  if (!validateEmail(email)) {
    errors.push(RegisterError.InvalidEmail);
  }
  if (!password || password.length > 25) {
    errors.push(RegisterError.InvalidPassword);
  }
  if (!name || name.length > 254) {
    errors.push(RegisterError.InvalidName);
  }

  if (errors.length > 0) return { errors };

  const {
    data,
    errorCode
  } = await createAccountApi(email, password, name);
  if (!errorCode) {
    errors = null;

    const {
      id,
      fullName,
      balance,
      email,
      lastBidDateTime
    } = data;

    result = {
      id,
      name: fullName,
      email,
      balance,
      lastBidDateTime: lastBidDateTime ? moment(lastBidDateTime) : null
    };
  } else {
    switch (errorCode) {
      case ApiErrorCode.EXISTED:
        errors.push(RegisterError.EmailExisted);
        break;
      case ApiErrorCode.INVALID_DATA:
        errors.push(RegisterError.InvalidName, RegisterError.InvalidEmail, RegisterError.InvalidPassword);
        break;
      default:
        errors.push(RegisterError.Unknown);
        break;
    }
  }

  return {
    errors,
    data: result
  };
}
