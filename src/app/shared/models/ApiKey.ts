import {User} from "./User";
import {Url} from "./Url";

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
