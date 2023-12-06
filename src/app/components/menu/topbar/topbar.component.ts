import {Component, HostListener, ElementRef, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../../services/auth/authentication.service";
import {authGuard} from "../../../services/guard/auth.guard";
import {UserService} from "../../../services/user/user.service";
import {UserPrivateDataResponse} from "../../../models/user-private-data-response";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent implements OnInit{
  dropdownOpen = false;
  username: string | null | undefined = '';
  balance: number | undefined;
  private authSubscription: Subscription | undefined;
  constructor(private eRef: ElementRef,
              public authService: AuthenticationService,
              private router: Router,
              private userService: UserService) {

  }
  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticatedObservable.subscribe(
      (isAuthenticated) => {
        if (isAuthenticated) {
          this.userService.getPrivateUserData().subscribe(
            (response: UserPrivateDataResponse) => {
              this.username = response.username;
              this.balance = response.balance;
            }
          );
        } else {
          // Reset the user data when logged out
          this.username = '';
          this.balance = undefined;
        }
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  onLogout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  protected readonly authGuard = authGuard;
}
