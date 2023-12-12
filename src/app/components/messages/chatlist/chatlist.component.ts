import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {ChatService} from "../../../services/chat/chat.service";
import {Router} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import { CommonModule } from '@angular/common';
import {BrowserModule} from "@angular/platform-browser";
import {NgFor} from '@angular/common';
@Component({
  selector: 'app-chatlist',
  standalone: true,
  imports: [
    NgFor,
    NgClass
  ],
  templateUrl: './chatlist.component.html',
  styleUrl: './chatlist.component.css'
})
export class ChatListComponent implements OnInit {
  selectedChatUser: string | null = null;
  chatList: any[] = []; // Replace with appropriate type
  username: string | null = this.userService.getUserNicknameFromToken();
  constructor(private chatService: ChatService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    if (this.username) {
      this.chatService.getChatList(this.username).subscribe(chatList => {
        this.chatList = chatList;
      });
    }
  }
  selectChatUser(chatUser: string): void {
    this.selectedChatUser = chatUser;
    // Add any additional logic you want to execute when a chat user is selected
  }
  navigateToChat(recipientUsername: string): void {
    this.router.navigate(['/chat', recipientUsername]); // Assuming /chat/:username is your chat route
  }

}
