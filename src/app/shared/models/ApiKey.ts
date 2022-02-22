import {User} from "./User";

export interface ApiKey {
  id: Number;
  apiKey: String;
  owner: User;
  apiCallsLimit: Number;
  apiCallsUsed: Number;
  createDate: Date;
  expirationDate: Date;
}
