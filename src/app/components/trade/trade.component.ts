import {Component, OnInit} from '@angular/core';
import {TradeService} from "../../services/trade/trade.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-trade',
  standalone: true,
  imports: [],
  templateUrl: './trade.component.html',
  styleUrl: './trade.component.css'
})
export class TradeComponent implements OnInit{
  username: string | undefined;
  currentTrade: any; // Replace 'any' with an appropriate type

  constructor(private tradeService: TradeService, private userService: UserService) {}

  ngOnInit(): void {
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
  }


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

