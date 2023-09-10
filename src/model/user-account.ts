import moment from "moment-timezone";

import {
  AccountSessionStorage,
  UserSessionModel
} from "types/models";

import { EventEmitter } from "utils/event-emitter";
import { EventName } from "types/event-emitter";

const StorageKey = "ssInfo";

let data: UserSessionModel = {
  id: null,
  token: "",
  expiry: null,
  expired: false
};

const authAccount = (
  id: number,
  token: string,
  expiration: moment.Moment
): void => {
  data = {
    id,
    token,
    expired: false,
    expiry: moment(expiration)
  };

  const utc = expiration.toISOString();
  const dataStorage: AccountSessionStorage = {
    id,
    token,
    expiry: utc
  };

  const storageStr = JSON.stringify(dataStorage);
  localStorage.setItem(StorageKey, storageStr);

  onAccountChange();
};

const updateAccountInfo = async(name: string, balance: number) : Promise<void> => {
  data.name = name;
  data.balance = balance;

  onAccountChange();
};

const loadStorage = (): void => {
  const dataStr = localStorage.getItem(StorageKey);
  if (!!dataStr) {
    const {
      id,
      token,
      expiry: expirationStr
    }: AccountSessionStorage = JSON.parse(dataStr);
    console.log("storage", dataStr);

    const nowMm = moment().add(2, "minutes");
    const expirationMm = !!expirationStr ? moment(expirationStr) : null;
    if (expirationMm !== null && expirationMm.isAfter(nowMm)) {
      data = {
        id,
        token,
        expiry: expirationMm,
        expired: false
      };

      onAccountChange();
    } else {
      clearData();
    }
  }
};

const clearData = (): void => {
  data = {
    id: null,
    token: null,
    expiry: null,
    expired: false
  };

  localStorage.removeItem(StorageKey);
};

const invalidateAccount = async (): Promise<void> => {
  clearData();
  onAccountChange();
};

const getInfo = (): UserSessionModel => {
  return { ...data };
};

const retrieveAuthToken = (): string => {
  const {
    expiry,
    token
  } = data;
  const nowMm = moment().add(2, "minutes");

  if (!!expiry && expiry.isAfter(nowMm)) return token;

  onAuthExpired();

  return null;
};

const onAccountChange = (): void => {
  const newData = { ...data };
  EventEmitter.emit(EventName.UserSessionChange, newData);
};

const onAuthExpired = (): void => {
  clearData();
  onAccountChange();
};

const subscribeAccountChange = (onChange: (data: UserSessionModel) => void): void => {
  EventEmitter.subscribe(EventName.UserSessionChange, onChange);
};

const unsubscribeAccountChange = (onChange: (data: UserSessionModel) => void): void => {
  EventEmitter.unsubscribe(EventName.UserSessionChange, onChange);
};

loadStorage();

export {
  getInfo,
  authAccount,
  updateAccountInfo,
  retrieveAuthToken,
  invalidateAccount,
  subscribeAccountChange,
  unsubscribeAccountChange,
  onAuthExpired
};
