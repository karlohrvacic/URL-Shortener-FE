import {User} from "./User";

export interface Url {
  id: Number;
  longUrl: String;
  shortUrl: String;
  owner: User;
  createDate: Date;
  lastAccessed: Date;
  visits: Number;
}
