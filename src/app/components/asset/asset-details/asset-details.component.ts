import {Component, Input, OnInit} from '@angular/core';
import {AssetService} from "../../../services/asset/asset.service";
import {UserService} from "../../../services/user/user.service";
import {AssetDetailsDto} from "../../../models/asset/asset-details-dto";
import {ActivatedRoute, Router} from "@angular/router";
import {TradeResponse} from "../../../models/trade/trade-response";
import {TradeService} from "../../../services/trade/trade.service";
import {FormsModule} from "@angular/forms";
import {ErrorComponent} from "../../error/error.component";
import {MatDialog} from "@angular/material/dialog";
import {ChatComponent} from "../../messages/chat/chat.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    FormsModule,
    ChatComponent,
    NgIf
  ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.css'
})
export class AssetDetailsComponent implements OnInit {
  @Input() trade: boolean | null | undefined;
  asset: AssetDetailsDto | undefined;
  purchaseAmount: number = 1;
  username = this.userService.getUserNicknameFromToken();
  constructor(private assetService: AssetService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private tradeService: TradeService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    if (this.username) {
      this.tradeService.initializeWebSocketConnection(this.username);
      this.loadAsset();
      if (this.asset?.user.username != this.username) {

      }
    } else {
      console.error('Username is not available for WebSocket connection');
    }
  }
  showChat() : string | undefined | null {
    return this.asset?.user.username != this.username ? this.asset?.user.username : null;
  }

  loadAsset(): void {
    const assetId = this.route.snapshot.paramMap.get('assetId');
    if (assetId) {
      this.assetService.getAsset(+assetId).subscribe({
        next: (data) => {
          this.asset = data;
          console.log("Asset loaded:", data);
        },
        error: (error) => console.error("Error loading asset:", error)
      });
    } else {
      console.log("No assetId found in URL");
    }
  }

  initiateTrade(amount: number): void {
    if (this.asset && this.asset.id) {
      const assetId = this.asset.id;

      this.userService.getPublicUserData(this.userService.getUserNicknameFromToken()).subscribe({
        next: (data) => {
          const buyerUserId = data.id; // Fetch the buyer's user ID
          console.log('Initiating trade for assetId:', assetId, 'amount:', amount, 'buyerUserId:', buyerUserId);

          this.tradeService.initiateTrade({buyerUserId, assetId, amount}).subscribe((tradeId: string) => {
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
  }

  openUpdatePage(): void {
    if (this.asset) {
      this.router.navigate(['/assets/update', this.asset.id]);
    }
  }

}
