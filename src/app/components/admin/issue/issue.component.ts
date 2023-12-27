import {Component, OnInit} from '@angular/core';
import {AdminService} from "../../../services/admin/admin.service";
import {Router} from "@angular/router";
import {TradeResponse} from "../../../models/trade/trade-response";
import {NgFor, NgForOf} from "@angular/common";

@Component({
  selector: 'app-issue',
  standalone: true,
  imports: [NgFor, NgForOf],
  templateUrl: './issue.component.html',
  styleUrl: './issue.component.css'
})
export class IssueComponent implements OnInit {
  issuedTrades: TradeResponse[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.getIssuedTrades();
  }

  getIssuedTrades(): void {
    this.adminService.getIssuedTrades().subscribe({
      next: (trades) => {
        this.issuedTrades = trades;
      },
      error: (error) => {
        // Handle error
      }
    });
  }

  confirmTrade(tradeId: string, username: string): void {
    this.adminService.confirmTrade(tradeId, username)
      .subscribe({
        next: (response) => {
          // Handle confirmation success
          this.getIssuedTrades(); // Refresh the list of issued trades
        },
        error: (error) => {
          // Handle error
        }
      });
  }

  cancelTrade(tradeId: string, username: string): void {
    this.adminService.cancelTrade(tradeId, username)
      .subscribe({
        next: (response) => {
          // Handle cancellation success
          this.getIssuedTrades(); // Refresh the list
        },
        error: (error) => {
          // Handle error
        }
      });
  }

  navigateToChat(username: string): void {
    this.router.navigate(['/chat', username]);
  }
}
