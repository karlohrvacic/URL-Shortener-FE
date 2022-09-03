import {Authorities} from "./Authorities";

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

