import { Component } from '@angular/core';
import {ChatListComponent} from "./chatlist/chatlist.component";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [
    ChatListComponent
  ],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {

}
