import { Component } from '@angular/core';
import {TradeService} from "../../../services/trade/trade.service";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-trade-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './trade-details.component.html',
  styleUrl: './trade-details.component.css'
})
export class TradeDetailsComponent {
  currentTrade: any; // Replace 'any' with an appropriate type

  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    this.tradeService.getTradeUpdates().subscribe(tradeUpdate => {
      if (tradeUpdate) {
        this.currentTrade = tradeUpdate;
        console.log('Trade Update:', tradeUpdate);
      }
    });
  }
}
