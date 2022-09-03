import {User} from "./User";

export interface ApiKey {
  id: number;
  key: string;
  owner: User;
  apiCallsLimit: number;
  apiCallsUsed: number;
  createDate: Date;
  expirationDate: Date;
  active: Boolean;
}
