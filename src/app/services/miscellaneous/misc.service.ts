import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MiscService {
  private userUrl = 'https://localhost:8080/misc';
  constructor(private http: HttpClient) {
  }

  getUserIp(): Observable<string> {
    return this.http.get<string>(`${this.userUrl}/get-ip`, { responseType: 'text' as 'json' });
  }
  getCurrentDate(): Observable<string> {
    return this.http.get<string>(`${this.userUrl}/get-date`, { responseType: 'text' as 'json' });
  }


}
