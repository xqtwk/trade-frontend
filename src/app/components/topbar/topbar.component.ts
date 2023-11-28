import {Component, HostListener, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  dropdownOpen = false;

  constructor(private eRef: ElementRef) {}

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }
}
