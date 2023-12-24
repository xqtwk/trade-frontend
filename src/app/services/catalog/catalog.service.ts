import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {GameDetailsDto} from "../../models/catalog/game-details-dto";
import {AssetDetailsDto} from "../../models/asset/asset-details-dto";
import {AssetTypeDetailsDto} from "../../models/catalog/asset-type-details-dto";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private baseUrl = environment.apiUrl
  constructor(private http: HttpClient, private userService: UserService) {
  }
  getAllGames(): Observable<GameDetailsDto[]> {
    return this.http.get<GameDetailsDto[]>(`${this.baseUrl}games`);
  }

  getAllAssets(): Observable<AssetDetailsDto[]> {
    return this.http.get<AssetDetailsDto[]>(`${this.baseUrl}assets`);
  }

  getAllAssetTypes(): Observable<AssetTypeDetailsDto[]> {
    return this.http.get<AssetTypeDetailsDto[]>(`${this.baseUrl}asset-types`);
  }

  getGameById(id: number): Observable<GameDetailsDto> {
    return this.http.get<GameDetailsDto>(`${this.baseUrl}games/${id}`);
  }

  getAssetById(id: number): Observable<GameDetailsDto> {
    return this.http.get<GameDetailsDto>(`${this.baseUrl}assets/${id}`);
  }

  getAssetTypeById(id: number): Observable<GameDetailsDto> {
    return this.http.get<GameDetailsDto>(`${this.baseUrl}asset-types/${id}`);
  }

  getAssetTypesByGameName(gameName: string): Observable<AssetTypeDetailsDto[]> {
    return this.http.get<AssetTypeDetailsDto[]>(`${this.baseUrl}asset-types/game/${gameName}`);
  }
  getAssetsByGameName(gameName: string): Observable<AssetDetailsDto[]> {
    return this.http.get<AssetDetailsDto[]>(`${this.baseUrl}assets/game/${gameName}`);
  }
}
