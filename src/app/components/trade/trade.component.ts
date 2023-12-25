import {Component, OnInit} from '@angular/core';
import {TradeService} from "../../services/trade/trade.service";
import {UserService} from "../../services/user/user.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ChatMessage} from "../../models/chat/chat-message";
import {ActivatedRoute} from "@angular/router";
import {ChatComponent} from "../messages/chat/chat.component";
import {AssetDetailsDto} from "../../models/asset/asset-details-dto";
import {AssetService} from "../../services/asset/asset.service";
import {MatDialog} from "@angular/material/dialog";
import {ErrorComponent} from "../error/error.component";

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit{
  username: string | null = this.userService.getUserNicknameFromToken(); // Fetch the current user's username
  currentTrade: any; // Replace 'any' with an appropriate type
  tradeId: number | undefined;
  asset: AssetDetailsDto | undefined
  constructor(private tradeService: TradeService,
              private userService: UserService,
              private route: ActivatedRoute,
              private assetService: AssetService,
              private dialog: MatDialog) {}


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tradeIdParam = params.get('tradeId');
      if (tradeIdParam) {
        this.tradeId = +tradeIdParam;
        if (this.tradeId) {
          this.tradeService.getTradeDetails(this.tradeId).subscribe(trade => {
            this.currentTrade = trade;
            if (this.currentTrade && this.currentTrade.assetId) {
              this.assetService.getAsset(this.currentTrade.assetId).subscribe(asset => {
                this.asset = asset; // Setting the asset to the current trade
              });
            }
          });
        }
      } else {
        console.error('Trade ID is missing in the route parameters.');
        // Handle the case where tradeId is missing or invalid
      }
    });
    if (this.username) {
      this.tradeService.initializeWebSocketConnection(this.username);
    }else {
      console.error('Username is not available for WebSocket connection');
    }
    this.tradeService.getTradeUpdates().subscribe(tradeUpdate => {
      if (tradeUpdate) {
        this.currentTrade = { ...tradeUpdate };
        console.log('Trade Update:', tradeUpdate);
      }
    });
  }

  getChatRecipient(): string | null {
    if (!this.currentTrade || !this.username) return null;

    // Determine the chat recipient based on the user's role in the trade
    return this.username === this.currentTrade.senderUsername ? this.currentTrade.receiverUsername : this.currentTrade.senderUsername;
  }


  confirmTrade(tradeId: string): void {
    if (this.username)
    this.tradeService.confirmTrade(tradeId, this.username);
  }

  // DISCONNECT
  ngOnDestroy() {
    this.tradeService.disconnect();
  }
}

