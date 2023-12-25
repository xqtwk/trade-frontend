import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AssetTypeDetailsDto} from "../../../models/catalog/asset-type-details-dto";
import {AssetTypeCreationDto, AssetTypeType} from "../../../models/catalog/asset-type-creation-dto";
import {AdminService} from "../../../services/admin/admin.service";
import {CatalogService} from "../../../services/catalog/catalog.service";
import {GameDetailsDto} from "../../../models/catalog/game-details-dto";
import {CommonModule} from "@angular/common";
import {GameCreationDto} from "../../../models/catalog/game-creation-dto";
import {Observable} from "rxjs";
import {AssetDetailsDto} from "../../../models/asset/asset-details-dto";

@Component({
  selector: 'app-asset-type',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './asset-type.component.html',
  styleUrl: './asset-type.component.css'
})
export class AssetTypeComponent {
  assetTypes: AssetTypeDetailsDto[] = [];
  games: GameDetailsDto[] = [];
  assetTypeForm: FormGroup;
  updateAssetTypeForm: FormGroup;
  isUpdating: boolean = false;
  updatingAssetTypeId: number | null = null;

  assetTypeTypes = Object.entries(AssetTypeType)
    .map(([key, value]) => ({ label: value, value: key }));
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private catalogService: CatalogService,
  ) {
    this.assetTypeForm = this.fb.group({
      name: ['', Validators.required] ,// Adjust according to AssetType properties
      gameId: [null, Validators.required], // gameId added to the form
      type: [Validators.required]
    });
    this.updateAssetTypeForm = this.fb.group({
      name: ['', Validators.required], // Adjust according to AssetType properties
      gameId: [null, Validators.required], // Include gameId in the update form
      type: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadAssetTypes();
    this.loadGames(); // Load games on init
  }

  loadAssetTypes(): void {
    console.log("fires")
    this.catalogService.getAllAssetTypes().subscribe({
      next: (data) =>{ this.assetTypes = data; console.log(this.assetTypes)},
      error: (error) => console.error("erroro")
    });
  }
  loadGames(): void {
    console.log("fires")
    this.catalogService.getAllGames().subscribe({
      next: (data) =>{ this.games = data; console.log("no games?")},
      error: (error) => console.error("erroro")
    });
  }

  onSubmit(): void {
    if (this.assetTypeForm.valid) {
      const newAssetTypeDto: AssetTypeCreationDto = this.assetTypeForm.value;
      console.log(newAssetTypeDto);
      this.createAssetType(newAssetTypeDto).subscribe(
        (createdAssetType: AssetTypeDetailsDto) => {
          console.log('Game created successfully', createdAssetType.id);
          // Handle the response here, like updating the UI or redirecting
        },
        (error) => {
          console.error('Error creating game:', error);
          // Handle the error here
        }
      );
    }
  }
  private createAssetType(dto: AssetTypeCreationDto): Observable<AssetTypeDetailsDto> {
    return this.adminService.createAssetType(dto);
  }

  openUpdateForm(assetType: AssetTypeDetailsDto): void {
    this.isUpdating = true;
    this.updatingAssetTypeId = assetType.id;
    this.updateAssetTypeForm.setValue({
      name: assetType.name,
      gameId: assetType.game.id // Set the gameId for the update form
    });
  }

  closeUpdateForm(): void {
    this.isUpdating = false;
    this.updatingAssetTypeId = null;
  }

  onUpdateSubmit(): void {
    if (this.updateAssetTypeForm.valid && this.updatingAssetTypeId !== null) {
      const updatedAssetTypeDto: AssetTypeCreationDto = this.updateAssetTypeForm.value;
      this.updateAssetType(updatedAssetTypeDto, this.updatingAssetTypeId).subscribe(
        updatedAssetType => {
          // Find and update the asset type in the assetTypes array
          const index = this.assetTypes.findIndex(at => at.id === updatedAssetType.id);
          if (index !== -1) {
            this.assetTypes[index] = updatedAssetType;
          }
          this.closeUpdateForm();
          // Handle success (e.g., display a success message)
        },
        error => {
          console.error('Error updating asset type:', error);
          // Handle error (e.g., display an error message)
        }
      );
    }
  }

  private updateAssetType(dto: AssetTypeCreationDto, id: number): Observable<AssetTypeDetailsDto> {
    return this.adminService.updateAssetType(id, dto);
  }
  deleteAssetType(id: number): void {
    if (confirm('Are you sure you want to delete this asset type?')) {
      this.adminService.deleteAssetType(id).subscribe(() => {
        this.assetTypes = this.assetTypes.filter(game => game.id !== id);
        console.log('AssertType deleted successfully');
        // Optionally, add more UI feedback here
      }, error => {
        console.error('Error deleting the game:', error);
        // Handle errors here
      });
    }
  }

}
