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
import {MillisToMinutesSecondsPipe} from "../../pipes/millis-to-minutes-seconds.pipe";

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatComponent, MillisToMinutesSecondsPipe],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit{
  username: string | null = this.userService.getUserNicknameFromToken(); // Fetch the current user's username
  currentTrade: any; // Replace 'any' with an appropriate type
  tradeId: number | undefined;
  asset: AssetDetailsDto | undefined
  remainingTime: number = 0; // Remaining time in milliseconds
  showCancel: boolean = false; // Whether to show the cancel button
  showTimer: boolean = false;
  timerInterval: any; // Timer interval
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
                console.log(asset.assetType);
              });
            }
              this.initializeTimer();
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
      if (tradeUpdate) {  this.tradeService.getTradeUpdates().subscribe(tradeUpdate => {
        if (tradeUpdate) {
          this.currentTrade = { ...tradeUpdate };
          this.initializeTimer();
          console.log('Trade Update:', tradeUpdate);

          // Check if the trade status is COMPLETED or CANCELLED
          if (this.currentTrade.status === "COMPLETED" || this.currentTrade.status === "CANCELLED") {
            // Disconnect the WebSocket when the trade is completed or cancelled
            this.tradeService.disconnect();
          }
        }
      });
        this.currentTrade = { ...tradeUpdate };
        this.initializeTimer();
        console.log('Trade Update:', tradeUpdate);
      }
    });
  }
  initializeTimer() {
    if (this.currentTrade && this.currentTrade.creationTime) {
      if (this.currentTrade.status === "CANCELLED" || this.currentTrade.status === "COMPLETED") {
        clearInterval(this.timerInterval);
        this.showTimer = false;
        this.showCancel = false;
        return;// Exit the function early
      }
        const creationTimeUtc = new Date(this.currentTrade.creationTime + 'Z').getTime();
        const now = new Date().getTime();
        const duration = 30 * 60 * 1000; // 30 minutes in milliseconds
        this.remainingTime = creationTimeUtc + duration - now;
        if (this.remainingTime > 0) {
          this.showTimer = true;
          this.timerInterval = setInterval(() => {
            this.remainingTime -= 1000;
            if (this.remainingTime <= 0) {
              clearInterval(this.timerInterval);
              this.showCancel = true;
              this.remainingTime = 0;
            }
          }, 1000);
        } else {
          this.showCancel = true;
        }

    }
  }

  cancelTrade(tradeId: string): void {
    if (this.username)
      this.tradeService.cancelTrade(tradeId, this.username);
  }

  issueTrade(tradeId: string): void {
    console.log("fired");
    if (this.username)
      this.tradeService.issueTrade(tradeId, this.username);
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

