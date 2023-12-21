import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {GameDetailsDto} from "../../models/catalog/game-details-dto";
import {GameCreationDto} from "../../models/catalog/game-creation-dto";
import {AssetCreationDto} from "../../models/catalog/asset-creation-dto";
import {AssetDetailsDto} from "../../models/catalog/asset-details-dto";
import {AssetTypeCreationDto} from "../../models/catalog/asset-type-creation-dto";
import {AssetTypeDetailsDto} from "../../models/catalog/asset-type-details-dto";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = environment.apiUrl + 'admin';
  constructor(private http: HttpClient, private userService: UserService) {
  }
  // Game methods
  createGame(dto: GameCreationDto): Observable<GameDetailsDto> {
    return this.http.post<GameDetailsDto>(`${this.baseUrl}/games/create`, dto);
  }

  updateGame(id: number, dto: GameCreationDto): Observable<GameDetailsDto> {
    return this.http.put<GameDetailsDto>(`${this.baseUrl}/games/update/${id}`, dto);
  }

  deleteGame(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/games/delete/${id}`);
  }

  // Asset methods

  // Asset Type methods
  createAssetType(dto: AssetTypeCreationDto): Observable<AssetTypeDetailsDto> {
    return this.http.post<AssetTypeDetailsDto>(`${this.baseUrl}/asset-types/create`, dto);
  }

  updateAssetType(id: number, dto: AssetTypeCreationDto): Observable<AssetTypeDetailsDto> {
    return this.http.put<AssetTypeDetailsDto>(`${this.baseUrl}/asset-types/update/${id}`, dto);
  }

  deleteAssetType(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/asset-types/delete/${id}`);
  }



}
