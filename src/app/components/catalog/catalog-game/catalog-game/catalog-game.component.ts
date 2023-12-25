import { Component } from '@angular/core';
import {AssetTypeDetailsDto} from "../../../../models/catalog/asset-type-details-dto";
import {GameDetailsDto} from "../../../../models/catalog/game-details-dto";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AdminService} from "../../../../services/admin/admin.service";
import {CatalogService} from "../../../../services/catalog/catalog.service";
import {AssetTypeCreationDto} from "../../../../models/catalog/asset-type-creation-dto";
import {Observable} from "rxjs";
import {CommonModule} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AssetDetailsDto} from "../../../../models/asset/asset-details-dto";
import {TradeService} from "../../../../services/trade/trade.service";
import {UserService} from "../../../../services/user/user.service";
import {ErrorComponent} from "../../../error/error.component";
import {MatDialog} from "@angular/material/dialog";
import {TradeResponse} from "../../../../models/trade/trade-response";

@Component({
  selector: 'app-catalog-game',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './catalog-game.component.html',
  styleUrl: './catalog-game.component.css'
})
export class CatalogGameComponent {
  assetTypes: AssetTypeDetailsDto[] = [];
  games: GameDetailsDto[] = [];
  assetTypeForm: FormGroup;
  updateAssetTypeForm: FormGroup;
  isUpdating: boolean = false;
  updatingAssetTypeId: number | null = null;
  gameName: string | null | undefined;
  assets: AssetDetailsDto[] = [];
  buyerId: number | undefined;
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private catalogService: CatalogService,
    private route: ActivatedRoute,
    private tradeService: TradeService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.assetTypeForm = this.fb.group({
      name: ['', Validators.required] ,// Adjust according to AssetType properties
      gameId: [null, Validators.required] // gameId added to the form
    });
    this.updateAssetTypeForm = this.fb.group({
      name: ['', Validators.required], // Adjust according to AssetType properties
      gameId: [null, Validators.required] // Include gameId in the update form
    });
  }
  initiateTrade(assetId: number, amount: number): void {
    this.userService.getPublicUserData(this.userService.getUserNicknameFromToken()).subscribe({
      next: (data) => {
        const buyerUserId = data.id; // Fetch the buyer's user ID
        console.log('Initiating trade for assetId:', assetId, 'amount:', amount, 'buyerUserId:', buyerUserId);

        this.tradeService.initiateTrade({ buyerUserId, assetId, amount }).subscribe((tradeId: string) => {
          console.log('Received tradeId:', tradeId);
          const numericTradeId = Number(tradeId);

          this.tradeService.getTradeUpdates().subscribe((tradeDetails: TradeResponse) => {
            console.log('Checking trade update for ID:', numericTradeId);

            if (tradeDetails && tradeDetails.id === numericTradeId) {
              console.log('Received new trade details:', tradeDetails);
              this.router.navigate(['/trade', tradeDetails.id]);
            }
          });

          this.router.navigate(['/trade', tradeId]);
        });
      },
      error: (error) => console.error("Error fetching user data: ", error)
    });
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gameName');
    if (this.gameName) {
      const username = this.userService.getUserNicknameFromToken();
      if (username) {
        this.tradeService.initializeWebSocketConnection(username);
        this.loadAssetTypesForGame(this.gameName);
        this.loadAssetsForGame(this.gameName);
      } else {
        console.error('Username is not available for WebSocket connection');
      }
    }
    this.tradeService.getTradeErrors().subscribe(errorMessage => {
      if (errorMessage) {
        this.dialog.open(ErrorComponent, {
          data: { message: errorMessage }
        });
      }
    });
    // ... other initialization
  }
  loadAssetTypesForGame(gameName: string): void {
    this.catalogService.getAssetTypesByGameName(gameName).subscribe({
      next: (data) => {
        this.assetTypes = data;
        console.log('Asset types for game:', data);
      },
      error: (error) => console.error("Error loading asset types:", error)
    });
  }
  loadAssetsForGame(gameName: string): void {
    console.log(`Loading assets for game: ${gameName}`);
    this.catalogService.getAssetsByGameName(gameName).subscribe({
      next: (data) => {
        this.assets = data;
        console.log('Assets:', this.assets);
      },
      error: (error) => {
        console.error("Error loading assets:", error);
      }
    });
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
        console.log('Asset Type deleted successfully');
        // Optionally, add more UI feedback here
      }, error => {
        console.error('Error deleting the game:', error);
        // Handle errors here
      });
    }
  }
  ngOnDestroy() {
    this.tradeService.disconnect();
  }

}
