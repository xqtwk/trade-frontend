import { Component } from '@angular/core';
import {AssetDetailsDto} from "../../models/asset/asset-details-dto";
import {GameDetailsDto} from "../../models/catalog/game-details-dto";
import {AssetTypeDetailsDto} from "../../models/catalog/asset-type-details-dto";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdminService} from "../../services/admin/admin.service";
import {CatalogService} from "../../services/catalog/catalog.service";
import {AssetCreationDto} from "../../models/asset/asset-creation-dto";
import {Observable} from "rxjs";
import {AssetService} from "../../services/asset/asset.service";
import {CommonModule} from "@angular/common";
import {UserPrivateDataResponse} from "../../models/user-private-data-response";
import {UserService} from "../../services/user/user.service";
import {CreateAssetComponent} from "./create-asset/create-asset.component";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-asset',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, RouterLink
  ],
  templateUrl: './asset.component.html',
  styleUrl: './asset.component.css'
})
export class AssetComponent {
  assets: AssetDetailsDto[] = [];
  games: GameDetailsDto[] = [];
  assetTypes: AssetTypeDetailsDto[] = [];
  updateAssetForm: FormGroup;
  isUpdating: boolean = false;
  updatingAssetId: number | null = null;
  user: UserPrivateDataResponse | undefined;
  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private fb: FormBuilder,
    private assetService: AssetService,
    private userService: UserService,
    private router: Router
  ) {
    this.updateAssetForm = this.fb.group({
      gameId: ['', Validators.required],
      assetTypeId: ['', Validators.required],
      userId: ['', Validators.required], // If you need to update user ID
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      amount: [''] // Optional
    });
  }

  ngOnInit(): void {
    this.loadAssets();
    this.loadGames();
    this.loadAssetTypes(); // Assuming you have a method to load asset types
  }
  openUpdatePage(assetId: number): void {
    this.router.navigate(['/assets/update', assetId]);
  }
  loadAssets(): void {
    const username = this.userService.getUserNicknameFromToken();
    if (username) {
      this.assetService.getAllUserAssets(username).subscribe({
        next: (data) =>{ this.assets = data; console.log("no assets?")},
        error: (error) => console.error("erroro")
      });
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

  private createAsset(dto: AssetCreationDto): Observable<AssetDetailsDto> {
    return this.assetService.createAsset(dto);
  }

  openUpdateForm(asset: AssetDetailsDto): void {
    this.isUpdating = true;
    this.updatingAssetId = asset.id;
    this.updateAssetForm.patchValue({
      gameId: asset.game.id,
      assetTypeId: asset.assetType.id,
      userId: asset.user.id, // If user information is part of the asset
      name: asset.name,
      description: asset.description,
      price: asset.price,
      amount: asset.amount
    });
  }

  onUpdateSubmit(): void {
    if (this.updateAssetForm.valid && this.updatingAssetId !== null) {
      const updatedAssetDto: AssetCreationDto = this.updateAssetForm.value;
      this.assetService.updateAsset(this.updatingAssetId, updatedAssetDto).subscribe(
        updatedAsset => {
          const index = this.assets.findIndex(a => a.id === updatedAsset.id);
          if (index !== -1) {
            this.assets[index] = updatedAsset;
          }
          this.closeUpdateForm();
          // Handle success
        },
        error => {
          // Handle error
        }
      );
    }
  }


  deleteAsset(id: number): void {
    if (confirm('Ar esate tikras, kad norite pašalinti šią prekę?')) {
      this.assetService.deleteAsset(id).subscribe(() => {
        this.assets = this.assets.filter(asset => asset.id !== id);
        // Handle successful deletion
      }, error => {
        // Handle error
      });
    }
  }
  closeUpdateForm(): void {
    this.isUpdating = false;
    this.updatingAssetId = null;
  }
}
