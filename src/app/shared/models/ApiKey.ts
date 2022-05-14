import {User} from "./User";
import {Url} from "./Url";

export interface ApiKey {
  id: Number;
  apiKey: String;
  owner: User;
  urls: Url[];
  apiCallsLimit: Number;
  apiCallsUsed: Number;
  createDate: Date;
  expirationDate: Date;
  active: Boolean;
}
