import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Url} from "../models/Url";
import {User} from "../models/User";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl : string = environment.API_URL + '/api/';

  addUrl(url : Url){
    return this.http.post(this.apiUrl + 'v1/url/', url, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getUrlByShortUrl(shortUrl : String){
    return this.http.get(this.apiUrl + 'v1/url/redirect/' + shortUrl, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  login(credentials: { email: string, password: string }) {
    return this.http.post(this.apiUrl + 'v1/auth/login', credentials, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  register(user : User) {
    return this.http.post(this.apiUrl + 'v1/auth/register', user, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });

  }

  editUser(user: User) {
    return this.http.put(this.apiUrl + 'v1/user', user, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  whoAmI() {
    return this.http.get(this.apiUrl + 'v2/user/whoAmI', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }
}
