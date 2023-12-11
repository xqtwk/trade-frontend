import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.apiUrl + 'profile';
  constructor(private http: HttpClient) { }
  getProfileInfo(userId: string) {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }
}
