import {User} from "./User";
import {ApiKey} from "./ApiKey";

export interface Url {
  id: Number;
  longUrl: String;
  shortUrl: String;
  owner: User;
  apiKey: ApiKey;
  createDate: Date;
  lastAccessed: Date;
  visits: Number;
  visitLimit: Number;
  active: Boolean;
}
