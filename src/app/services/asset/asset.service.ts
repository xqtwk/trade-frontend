import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {AssetDetailsDto} from "../../models/catalog/asset-details-dto";
import {AssetCreationDto} from "../../models/catalog/asset-creation-dto";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  private baseUrl = environment.apiUrl + "assets"
  constructor(private http: HttpClient, private userService: UserService) {
  }

  createAsset(dto: AssetCreationDto): Observable<AssetDetailsDto> {
    return this.http.post<AssetDetailsDto>(`${this.baseUrl}/create`, dto);
  }

  updateAsset(id: number, dto: AssetCreationDto): Observable<AssetDetailsDto> {
    return this.http.put<AssetDetailsDto>(`${this.baseUrl}/update/${id}`, dto);
  }

  deleteAsset(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  getAsset(id: number): Observable<AssetDetailsDto> {
    return this.http.get<AssetDetailsDto>(`${this.baseUrl}/${id}`);
  }

  getAllUserAssets(username: string): Observable<AssetDetailsDto[]> {
    return this.http.get<AssetDetailsDto[]>(`${this.baseUrl}/user/${username}`);
  }

}
