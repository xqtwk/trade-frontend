import {Component, HostListener, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/auth/authentication.service";
import {authGuard} from "../../services/guard/auth.guard";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  dropdownOpen = false;

  constructor(private eRef: ElementRef,
              public authService: AuthenticationService,
              private router: Router) {

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
