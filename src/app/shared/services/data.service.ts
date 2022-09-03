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

  private apiUrl: string = environment.API_URL + '/api/v1/';

  private options: object = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}),
    observe: 'response'
  };

  createUrlWithoutApiKey(url: Url) {
    return this.http.post(this.apiUrl + 'url/new/', url, this.options)
  }

  createUrlWithApiKey(url: Url, apiKey: string) {
    return this.http.post(this.apiUrl + 'url/new/' + apiKey, url, this.options);
  }

  getUrlByShortUrl(shortUrl: string) {
    return this.http.get(this.apiUrl + 'url/redirect/' + shortUrl, this.options);
  }

  revokeUrl(id: number) {
    return this.http.get(this.apiUrl + 'url/deactivate/' + id, this.options);
  }

  deleteUrl(id: number) {
    return this.http.get(this.apiUrl + 'url/delete/' + id, this.options);
  }

  updateUrl(urlUpdateDto: { id: number, visitLimit: number, expirationDate: Date }) {
    return this.http.put(this.apiUrl + 'url', urlUpdateDto, this.options);
  }

  getMyUrls() {
    return this.http.get(this.apiUrl + 'url/my/', this.options);
  }

  getAllUrls() {
    return this.http.get(this.apiUrl + 'url/all/', this.options);
  }

  login(loginDto: { email: string, password: string }) {
    return this.http.post(this.apiUrl + 'auth/login', loginDto, this.options);
  }

  register(user: User) {
    return this.http.post(this.apiUrl + 'auth/register', user, this.options);
  }

  requestPasswordChange(email: string) {
    return this.http.post(this.apiUrl + 'auth/reset-password', email, this.options);
  }

  changePassword(passwordResetDto: { token: string, email: string, password: string }) {
    return this.http.post(this.apiUrl + 'auth/reset-password/set-password', passwordResetDto, this.options);
  }

  getAllUsers() {
    return this.http.get(this.apiUrl + 'user/all', this.options);
  }

  deleteUser(id: number) {
    return this.http.delete(this.apiUrl + 'user' + id, this.options);
  }

  editUser(userUpdateDto: {id: number, name: string, email: string, apiKeySlots: number, active: Boolean}) {
    return this.http.put(this.apiUrl + 'user', userUpdateDto, this.options);
  }

  updatePassword(updatePasswordDto: {oldPassword: string, newPassword: string}) {
    return this.http.put(this.apiUrl + 'user/update-password', updatePasswordDto, this.options);
  }

  whoAmI() {
    return this.http.get(this.apiUrl + 'user/whoAmI', this.options);
  }

  createApiKey() {
    return this.http.get(this.apiUrl + 'key/new', this.options);
  }

  getAllMyApiKeys() {
    return this.http.get(this.apiUrl + 'key/my', this.options);
  }

  getAllApiKeys() {
    return this.http.get(this.apiUrl + 'key', this.options);
  }

  editApiKey(apiKeyUpdateDto: { id: number, apiCallsLimit: number, apiCallsUsed: number, expirationDate: Date, active: Boolean}) {
    return this.http.put(this.apiUrl + 'key', apiKeyUpdateDto, this.options);
  }

  revokeApiKey(id: number) {
    return this.http.get(this.apiUrl + 'key/revoke/' + id, this.options);
  }
}
