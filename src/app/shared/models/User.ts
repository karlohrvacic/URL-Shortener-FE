import {Authorities} from "./Authorities";
import {Url} from "./Url";
import {ApiKey} from "./ApiKey";

export interface User {
  id: Number;
  name: String;
  email: String;
  password: String;
  apiKeySlots: Number;
  authorities: Authorities[];
  createDate: Date;
  lastLogin: Date;
  active: Boolean;
}

