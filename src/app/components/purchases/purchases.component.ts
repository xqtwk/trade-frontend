import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TradeResponse} from "../../models/trade/trade-response";
import {Router, RouterLink} from "@angular/router";
import {TradeService} from "../../services/trade/trade.service";
import {UserService} from "../../services/user/user.service";

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {
  tradeList: TradeResponse[] = []; // Replace 'any[]' with the actual type of your trades
  username: string | null = this.userService.getUserNicknameFromToken();
  constructor(private router: Router, private tradeService: TradeService, private userService: UserService) {}
  ngOnInit(): void {
    // Fetch sender's trades from your TradeService
    if (this.username) {
      this.tradeService.getPurchasesList().subscribe(tradeList => {
        console.log("g");
        this.tradeList = tradeList;
        console.log(tradeList);
      });
    }
  }
  openTradeDetails(tradeId: string) {
    this.router.navigate(['/trade', tradeId]);
  }
}
