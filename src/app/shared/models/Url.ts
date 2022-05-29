import {User} from "./User";
import {ApiKey} from "./ApiKey";

export interface Url {
  id: number;
  longUrl: string;
  shortUrl: string;
  owner: User;
  apiKey: ApiKey;
  createDate: Date;
  lastAccessed: Date;
  visits: number;
  visitLimit: number;
  active: Boolean;
}
