import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Url} from "../models/url";
import {User} from "../models/user";


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  private apiUrl : string = environment.API_URL + '/api/v1/';

  addUrl(url : Url){
    return this.http.post(this.apiUrl + 'url/', url, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getUrlByShortUrl(shortUrl : String){
    return this.http.get(this.apiUrl + 'url/' + shortUrl, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  login(credentials : User) {
    return this.http.post(this.apiUrl + 'auth/login', credentials, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  register(user : User) {
    return this.http.post(this.apiUrl + 'auth/register', user, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });

  }

}
