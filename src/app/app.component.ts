import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from "./components/menu/sidebar/sidebar.component";
import {TopbarComponent} from "./components/menu/topbar/topbar.component";
import {MainComponent} from "./components/main/main.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, TopbarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'trade-frontend';
}
