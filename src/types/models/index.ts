import moment from "moment-timezone";

export interface AccountSessionStorage {
  id: number,
  token: string,
  expiry: string
}

export interface UserSessionModel {
  id: number,
  token: string,
  expiry: moment.Moment,
  expired: boolean,
  name?: string,
  balance?: number
}
