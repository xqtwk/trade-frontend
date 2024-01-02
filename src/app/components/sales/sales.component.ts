import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {TradeService} from "../../services/trade/trade.service";
import {UserService} from "../../services/user/user.service";
import {TradeResponse} from "../../models/trade/trade-response";

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css'
})
export class SalesComponent implements OnInit {
  tradeList: TradeResponse[] = []; // Replace 'any[]' with the actual type of your trades
  username: string | null = this.userService.getUserNicknameFromToken();
  constructor(private router: Router, private tradeService: TradeService, private userService: UserService) {}
  ngOnInit(): void {
    // Fetch sender's trades from your TradeService
    if (this.username) {
      this.tradeService.getSalesList().subscribe(tradeList => {
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
