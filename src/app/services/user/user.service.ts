import { Injectable } from '@angular/core';
import {UserPrivateDataResponse} from "../../models/user-private-data-response";
import {HttpClient} from "@angular/common/http";
import {ChangePasswordRequest} from "../../models/auth/change-password-request";
import {jwtDecode} from 'jwt-decode';
import {UserPublicDataResponse} from "../../models/user-public-data-response";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = environment.apiUrl + 'users';

  constructor(private http: HttpClient) {
  }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    return this.http.patch(`${this.userUrl}`, changePasswordRequest);
  }

  getUserNicknameFromToken(): string | null {
    const token = localStorage.getItem('token') // Implement this method to get the JWT from storage
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.sub; // Or the relevant field that contains the nickname
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  getUserRoleFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.role; // Adjust to match the claim name you used
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  getPublicUserData(username: string | null | undefined) {
    return this.http.get<UserPublicDataResponse>(`${this.userUrl}/get-public-data/${username}`);
  }

  getPrivateUserData() {
    return this.http.get<UserPrivateDataResponse>(`${this.userUrl}/get-private-data`);
  }

}
