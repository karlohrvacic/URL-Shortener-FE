import {User} from "./User";
import {Url} from "./Url";

export interface ApiKey {
  id: Number;
  key: String;
  owner: User;
  apiCallsLimit: Number;
  apiCallsUsed: Number;
  createDate: Date;
  expirationDate: Date;
  active: Boolean;
}
