import {Authorities} from "./Authorities";
import {Url} from "./Url";
import {ApiKey} from "./ApiKey";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  apiKeySlots: number;
  authorities: Authorities[];
  createDate: Date;
  lastLogin: Date;
  active: Boolean;
}

