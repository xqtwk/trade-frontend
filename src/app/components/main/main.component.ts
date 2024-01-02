import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/auth/authentication.service";
import {MessagesComponent} from "../messages/messages.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterLink, MessagesComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  constructor(public authService: AuthenticationService) {
  }

}
