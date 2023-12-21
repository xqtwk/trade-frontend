import {Component, OnInit} from '@angular/core';
import {TradeService} from "../../services/trade/trade.service";
import {UserService} from "../../services/user/user.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ChatMessage} from "../../models/chat/chat-message";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit{
  username: string | null = this.userService.getUserNicknameFromToken(); // Fetch the current user's username
  currentTrade: any; // Replace 'any' with an appropriate type
  tradeId: number | undefined;

  constructor(private tradeService: TradeService, private userService: UserService, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tradeIdParam = params.get('tradeId');
      if (tradeIdParam) {
        this.tradeId = +tradeIdParam;
        if (this.tradeId) {
          this.tradeService.getTradeDetails(this.tradeId).subscribe(trade => {
            this.currentTrade = trade;
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
        this.currentTrade = tradeUpdate;
        console.log('Trade Update:', tradeUpdate);
      }
    });
  }
  /*ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const tradeId = params.get('tradeId');
      this.tradeService.initializeWebSocketConnection(tradeId);
      console.log("tradeId: " + this.tradeId);
    });
    const username = this.userService.getUserNicknameFromToken(); // Fetch the current user's username
    if (username) {
      this.tradeService.initializeWebSocketConnection(username);
    }else {
      console.error('Username is not available for WebSocket connection');
    }
    this.tradeService.getTradeUpdates().subscribe(tradeUpdate => {
      if (tradeUpdate) {
        this.currentTrade = tradeUpdate;
        console.log('Trade Update:', tradeUpdate);
      }
    });
  }*/


  initiateTrade(assetId: number, amount: number): void {
    const buyerUserId = 'buyer-user-id'; // Fetch the buyer's user ID
    this.tradeService.initiateTrade({ buyerUserId, assetId, amount });
  }

  confirmTrade(tradeId: string): void {
    if (this.username)
    this.tradeService.confirmTrade(tradeId, this.username);
  }

  // Remember to disconnect on component destruction
  ngOnDestroy() {
    this.tradeService.disconnect();
  }
}

