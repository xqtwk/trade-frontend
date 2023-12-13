import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";
import {TradeService} from "../../services/trade/trade.service";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent {
  senderTrades: any[] = []; // Replace 'any[]' with the actual type of your trades

  constructor(private router: Router, private tradeService: TradeService) {}
  ngOnInit(): void {
    // Fetch sender's trades from your TradeService
    this.tradeService.fetchSenderTrades().subscribe(trades => {
      this.senderTrades = trades;
    });
  }
  openTradeDetails(tradeId: string) {
    // Navigate to the TradeDetailsComponent route with the tradeId as a parameter
    this.router.navigate(['/trade-details', tradeId]);
  }
}
