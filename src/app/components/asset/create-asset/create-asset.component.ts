import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {GameDetailsDto} from "../../../models/catalog/game-details-dto";
import {AssetTypeDetailsDto} from "../../../models/catalog/asset-type-details-dto";
import {AssetCreationDto} from "../../../models/catalog/asset-creation-dto";
import {Observable} from "rxjs";
import {AssetDetailsDto} from "../../../models/catalog/asset-details-dto";
import {AssetService} from "../../../services/asset/asset.service";
import {UserService} from "../../../services/user/user.service";
import {UserPrivateDataResponse} from "../../../models/user-private-data-response";
import {CatalogService} from "../../../services/catalog/catalog.service";
import {AutoExpandDirective} from "../../../directives/auto-expand.directive";

@Component({
  selector: 'app-create-asset',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AutoExpandDirective],
  templateUrl: './create-asset.component.html',
  styleUrl: './create-asset.component.css'
})
export class CreateAssetComponent implements OnInit {
  assetForm: FormGroup;
  user: UserPrivateDataResponse | undefined;
  games: GameDetailsDto[] = [];
  assetTypes: AssetTypeDetailsDto[] = [];
  isGameSelected: boolean = false;
  isAssetTypeSelected: boolean = false;
  constructor(
    private fb: FormBuilder,
    private assetService: AssetService,
    private userService: UserService,
    private catalogService: CatalogService
  ) {
    this.assetForm = this.fb.group({
      gameId: ['', Validators.required],
      assetTypeId: ['', Validators.required],
      userId: ['', Validators.required], // Assuming user ID is required; adjust as needed
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      amount: ['']
    });
  }
  ngOnInit(): void {
    this.loadGames();
    this.loadAssetTypes(); // Assuming you have a method to load asset types

  }
  private createAsset(dto: AssetCreationDto): Observable<AssetDetailsDto> {
    return this.assetService.createAsset(dto);
  }
  onSubmit(): void {
    this.userService.getPrivateUserData().subscribe({
      next: (data) =>{ this.user = data; console.log("loaded user " + this.user.id)},
      error: (error) => console.error("erroro")
    });
    this.assetForm.patchValue({
      userId: this.user?.id
    });
    console.log("assetformvalue " + this.assetForm.value.id);
    if (this.assetForm.valid) {
      const newAssetDto: AssetCreationDto = this.assetForm.value;
      this.createAsset(newAssetDto).subscribe(
        (createdAsset: AssetDetailsDto) => {
          console.log("asset created" + createdAsset.name)
        },
        (error) => {
          // Handle error
        }
      );
    }
  }
  loadGames(): void {
    console.log("fires")
    this.catalogService.getAllGames().subscribe({
      next: (data) =>{ this.games = data; console.log("no games?")},
      error: (error) => console.error("erroro")
    });
  }

  loadAssetTypes(): void {
    console.log("fires")
    this.catalogService.getAllAssetTypes().subscribe({
      next: (data) =>{ this.assetTypes = data; console.log(this.assetTypes)},
      error: (error) => console.error("erroro")
    });
  }

  onGameSelect(): void {
    const gameControl = this.assetForm.get('gameId');

    if (gameControl && gameControl.value) {
      this.isGameSelected = true;
      // Get the selected game's name
      const selectedGameName = this.games.find(game => game.id === gameControl.value)?.name;
      if (selectedGameName) {
        this.loadAssetTypesForGame(selectedGameName);
      }
      this.assetForm.get('assetTypeId')?.reset(); // Reset asset type selection
      this.isAssetTypeSelected = false;
    } else {
      this.isGameSelected = false;
    }
  }

  onAssetTypeSelect(): void {
    const assetTypeControl = this.assetForm.get('assetTypeId');

    this.isAssetTypeSelected = assetTypeControl ? !!assetTypeControl.value : false;
  }
  private loadAssetTypesForGame(gameName: string): void {
    this.catalogService.getAssetTypesByGameName(gameName).subscribe({
      next: (assetTypes) => {
        this.assetTypes = assetTypes;
      },
      error: (error) => {
        console.error('Error loading asset types:', error);
      }
    });
  }


/*
  getAssetTypesByGameName(gameName: string): Observable<AssetTypeDetailsDto[]> {
    return this.http.get<AssetTypeDetailsDto[]>(`${this.baseUrl}asset-types/game/${gameName}`);
  }
 */

}
