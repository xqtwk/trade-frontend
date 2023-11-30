import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = 'http://localhost:8080/profile';
  constructor(private http: HttpClient) { }
  getProfileInfo(userId: string) {
    return this.http.get(`${this.baseUrl}/${userId}`);
  }
}
