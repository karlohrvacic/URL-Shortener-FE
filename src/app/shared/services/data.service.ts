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

  private apiUrl : string = environment.API_URL + '/api/v1/';

  createUrlWithoutApiKey(url : Url){
    return this.http.post(this.apiUrl + 'url/new/', url, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  createUrlWithApiKey(url : Url, apiKey : String){
    return this.http.post(this.apiUrl + 'url/new/' + apiKey, url, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getUrlByShortUrl(shortUrl : String){
    return this.http.get(this.apiUrl + 'url/redirect/' + shortUrl, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getMyUrls(){
    return this.http.get(this.apiUrl + 'url/my/', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getAllUrls(){
    return this.http.get(this.apiUrl + 'url/all/', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  login(loginDto: { email: string, password: string }) {
    return this.http.post(this.apiUrl + 'auth/login', loginDto, {
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

  getAllUsers() {
    return this.http.get(this.apiUrl + 'user/all', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  deleteUser(id : Number) {
    return this.http.delete(this.apiUrl + 'user' + id, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  editUser(userUpdateDto: {id: Number, name: String, email: String, apiKeySlots: Number, active: Boolean}) {
    return this.http.put(this.apiUrl + 'user', userUpdateDto, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  whoAmI() {
    return this.http.get(this.apiUrl + 'user/whoAmI', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  createApiKey(){
    return this.http.get(this.apiUrl + 'key/new', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getAllMyApiKeys(){
    return this.http.get(this.apiUrl + 'key/my', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  getAllApiKeys(){
    return this.http.get(this.apiUrl + 'key', {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  editApiKey(apiKeyUpdateDto: { id: Number, apiCallsLimit: Number, apiCallsUsed: Number, expirationDate: Date, active: Boolean}) {
    return this.http.put(this.apiUrl + 'key', apiKeyUpdateDto, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }

  revokeApiKey(id: Number){
    return this.http.get(this.apiUrl + 'key/revoke/' + id, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    });
  }
}
