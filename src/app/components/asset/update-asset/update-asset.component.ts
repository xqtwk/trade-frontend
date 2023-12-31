import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../services/admin/admin.service";
import {CatalogService} from "../../../services/catalog/catalog.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AssetService} from "../../../services/asset/asset.service";
import {UserService} from "../../../services/user/user.service";
import {AssetDetailsDto} from "../../../models/asset/asset-details-dto";
import {GameDetailsDto} from "../../../models/catalog/game-details-dto";
import {AssetTypeDetailsDto} from "../../../models/catalog/asset-type-details-dto";
import {UserPrivateDataResponse} from "../../../models/user-private-data-response";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AssetCreationDto} from "../../../models/asset/asset-creation-dto";
import {AutoExpandDirective} from "../../../directives/auto-expand.directive";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../../error/error.component";
import {TradeService} from "../../../services/trade/trade.service";

@Component({
  selector: 'app-update-asset',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    AutoExpandDirective
  ],
  templateUrl: './update-asset.component.html',
  styleUrl: './update-asset.component.css'
})
export class UpdateAssetComponent implements OnInit {
  assets: AssetDetailsDto[] = [];
  games: GameDetailsDto[] = [];
  assetTypes: AssetTypeDetailsDto[] = [];
  updateAssetForm: FormGroup;
  updatingAssetId: number | null = null;
  username: string | null = null;
  assetId: number | undefined;

  constructor(
    private adminService: AdminService,
    private catalogService: CatalogService,
    private fb: FormBuilder,
    private assetService: AssetService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private tradeService: TradeService
  ) {
    this.updateAssetForm = this.fb.group({
      gameId: ['', Validators.required],
      assetTypeId: ['', Validators.required],
      userId: ['', Validators.required], // If you need to update user ID
      name: ['', Validators.required],
      description: [''],
      price: ['', Validators.required],
      amount: [''], // Optional
      unlimited: [],
    });
  }

  ngOnInit(): void {
    this.assetId = Number(this.route.snapshot.paramMap.get('assetId'));
    this.loadAssetDetails(this.assetId);
    this.loadGames();
    this.loadAssetTypes(); // Assuming you have methods to load games and asset types
    this.updateAssetForm.get('unlimited')?.valueChanges.subscribe((isChecked) => {
      const amountControl = this.updateAssetForm.get('amount');
      if (isChecked) {
        amountControl?.disable();
        amountControl?.setValue(null);
      } else {
        amountControl?.enable();
      }
    });

  }

  loadAssetDetails(assetId: number): void {
    this.assetService.getAsset(assetId).subscribe((asset: AssetDetailsDto) => {
      console.log("loaded asset " + asset);
      this.updateAssetForm.patchValue({
        gameId: asset.game.id,
        assetTypeId: asset.assetType.id,
        userId: asset.user.id, // If user information is part of the asset
        name: asset.name,
        description: asset.description,
        price: asset.price,
        amount: asset.amount
      });
      if (asset.amount == null) {
        this.updateAssetForm.patchValue({
          unlimited: true
        });
      }
    });
  }

  onUpdateSubmit(): void {
    if (this.updateAssetForm.valid && this.assetId !== undefined) {
      const updatedAssetDto: AssetCreationDto = this.updateAssetForm.value;
      delete (updatedAssetDto as any).unlimited;
      this.assetService.updateAsset(this.assetId, updatedAssetDto).subscribe(
        updatedAsset => {
          const index = this.assets.findIndex(a => a.id === updatedAsset.id);
          if (index !== -1) {
            this.assets[index] = updatedAsset;
          }
          console.log("success?");
          this.router.navigate(['/assets/', this.assetId]);
          this.ngOnDestroy();
        },
        error => {
          this.dialog.open(ErrorComponent, {
            data: {message: "Negalima redaguoti skelbimą, kai yra aktyvūs sandoriai, kuriuose jis dalyvauja."}
          });
        }
      );
    }
  }

  loadGames(): void {
    console.log("fires")
    this.catalogService.getAllGames().subscribe({
      next: (data) => {
        this.games = data;
        console.log("no games?")
      },
      error: (error) => console.error("erroro")
    });
  }

  loadAssetTypes(): void {
    console.log("fires")
    this.catalogService.getAllAssetTypes().subscribe({
      next: (data) => {
        this.assetTypes = data;
        console.log(this.assetTypes)
      },
      error: (error) => console.error("erroro")
    });
  }

  deleteAsset(): void {
    if (this.assetId) {
      if (confirm('Ar esate tikras, kad norite pašalinti šią prekę?')) {
        this.assetService.deleteAsset(this.assetId).subscribe(() => {
          this.router.navigate(['/assets']);
        }, error => {
        });
      }
    }

  }

  // DISCONNECT
  ngOnDestroy() {
    this.tradeService.disconnect();
  }
}
