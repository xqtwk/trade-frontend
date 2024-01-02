import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {GameDetailsDto} from "../../../models/catalog/game-details-dto";
import {AssetTypeDetailsDto} from "../../../models/catalog/asset-type-details-dto";
import {AssetCreationDto} from "../../../models/asset/asset-creation-dto";
import {Observable} from "rxjs";
import {AssetDetailsDto} from "../../../models/asset/asset-details-dto";
import {AssetService} from "../../../services/asset/asset.service";
import {UserService} from "../../../services/user/user.service";
import {UserPrivateDataResponse} from "../../../models/user-private-data-response";
import {CatalogService} from "../../../services/catalog/catalog.service";
import {AutoExpandDirective} from "../../../directives/auto-expand.directive";
import {Router} from "@angular/router";

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
    private catalogService: CatalogService,
    private router: Router
  ) {
    this.assetForm = this.fb.group({
      gameId: ['', Validators.required],
      assetTypeId: ['', Validators.required],
      userId: [''],
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      amount: [''],
      unlimited: [true]
    });
  }
  ngOnInit(): void {
    this.userService.getPrivateUserData().subscribe({
      next: (data) =>{ this.user = data; console.log("loaded user " + this.user.id)},
      error: (error) => console.error("erroro")
    });
    this.loadGames();
    this.loadAssetTypes(); // Assuming you have a method to load asset types
    this.assetForm.get('unlimited')?.valueChanges.subscribe((isChecked) => {
      const amountControl = this.assetForm.get('amount');
      if (isChecked) {
        amountControl?.disable();
        amountControl?.setValue(null);
      } else {
        amountControl?.enable();
      }
    });
  }
  private createAsset(dto: AssetCreationDto): Observable<AssetDetailsDto> {
    return this.assetService.createAsset(dto);
  }
  onSubmit(): void {
    this.assetForm.patchValue({
      userId: this.user?.id
    });
    console.log("assetformvalue ", this.assetForm.value);
    if (this.assetForm.valid) {
      const newAssetDto: AssetCreationDto = { ...this.assetForm.value };
      delete (newAssetDto as any).unlimited;
      console.log(newAssetDto);
      this.createAsset(newAssetDto).subscribe(
        (createdAsset: AssetDetailsDto) => {
          console.log("asset created" + createdAsset.id)
          this.router.navigate(['assets', createdAsset.id]);
        },
        (error) => {
          console.log("something happened");
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
