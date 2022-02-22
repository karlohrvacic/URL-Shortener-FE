import {Authorities} from "./Authorities";
import {Url} from "./Url";
import {ApiKey} from "./ApiKey";

export interface User {
  id: Number;
  name: String;
  email: String;
  password: String;
  apiKeys: ApiKey[];
  urls: Url[];
  authorities: Authorities[];
  createDate: Date;
  lastLogin: Date;
}
