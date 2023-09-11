import moment from "moment-timezone";

import {
  authenticateCredentialApi
} from "apis";

import { authAccount, getInfo, invalidateAccount } from "model/user-account";

import { validateEmail } from "utils/validation";

import {
  ResultWithError,
  SignInError
} from "types/services";
import {
  UserSessionModel
} from "types/models";

export const loginByUsernameAndPassword = async (username: string, password: string):
  Promise<ResultWithError<UserSessionModel, SignInError>> => {
  let errors: SignInError[] = [];
  let result: UserSessionModel = null;

  // validate inputs
  if (!validateEmail(username)) {
    errors.push(SignInError.InvalidEmail);
  }
  if (!password) {
    errors.push(SignInError.IncorrectEmailOrPassword);
  }

  if (errors.length > 0) return { errors };

  const {
    data,
    errorCode
  } = await authenticateCredentialApi(username, password);
  if (!errorCode) {
    const {
      id,
      accessToken,
      tokenExpiry
    } = data;

    errors = null;
    authAccount(id, accessToken, moment(tokenExpiry));
    result = getInfo();
  } else {
    errors.push(SignInError.IncorrectEmailOrPassword);
  }

  return {
    errors,
    data: result
  };
}

export const logout = async () : Promise<boolean> => {
  await invalidateAccount();
};

