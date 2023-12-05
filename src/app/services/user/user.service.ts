import { Injectable } from '@angular/core';
import {UserPrivateDataResponse} from "../../models/user-private-data-response";
import {HttpClient} from "@angular/common/http";
import {ChangePasswordRequest} from "../../models/change-password-request";
import {jwtDecode} from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'https://localhost:8080/users';

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

  getPublicUserData() {
    return this.http.get(`${this.userUrl}/get-public-data`);
  }

  getPrivateUserData() {
    return this.http.get(`${this.userUrl}/get-public-data`);
  }
}
