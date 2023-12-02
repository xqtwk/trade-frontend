import { Injectable } from '@angular/core';
import {User} from "../../models/User";
import {HttpClient} from "@angular/common/http";
import {ChangePasswordRequest} from "../../models/change-password-request";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'https://localhost:8080/users';

  constructor(private http: HttpClient) { }

  changePassword(changePasswordRequest: ChangePasswordRequest) {
    return this.http.patch(`${this.userUrl}`, changePasswordRequest);
  }

}
