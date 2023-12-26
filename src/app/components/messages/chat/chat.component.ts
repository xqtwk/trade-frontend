import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ChatMessage} from "../../../models/chat/chat-message";
import {ChatService} from "../../../services/chat/chat.service";
import {UserService} from "../../../services/user/user.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
import {ChatListComponent} from "../chatlist/chatlist.component";
import {BehaviorSubject, Observable, window} from "rxjs";
import {AutoExpandDirective} from "../../../directives/auto-expand.directive";

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatListComponent, AutoExpandDirective, ReactiveFormsModule, RouterLink],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  @ViewChild('messageList') private messageList!: ElementRef;
  @Input() recipientTrade: string | null | undefined;
  recipientUsername: string | null | undefined;
  messages: ChatMessage[] = [];
  newMessage: string = '';
  username: string | null = this.userService.getUserNicknameFromToken(); // This should be dynamically set based on the authenticated user
  isChatListVisible: boolean = false;

  constructor(private chatService: ChatService,
              private userService: UserService,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (!this.recipientTrade) {
        this.recipientUsername = params.get('username');
      } else {
        this.recipientUsername = this.recipientTrade;
      }
      console.log("Recipient username: " + this.recipientUsername);

      if (this.username != null && this.recipientUsername != null) {
        this.chatService.initializeWebSocketConnection(this.username);
        // Subscribe to getMessages() here
        this.chatService.loadChatMessages(this.username, this.recipientUsername);
        this.chatService.getMessages().subscribe((messages: ChatMessage[]) => {
          console.log("messages: "+messages); // Check if messages are received
          this.messages = messages;
          this.changeDetectorRef.detectChanges(); // Force change detection
        });
      }
    });
  }
  sendMessage(): void {
    if (this.username && this.recipientUsername) {
      const chatMessage: ChatMessage = {
        content: this.newMessage,
        senderUsername: this.username,
        recipientUsername: this.recipientUsername,
        timestamp: new Date().toISOString()
      };
      this.chatService.sendMessage(chatMessage);

      // Add the new message to the messages array
      this.messages.push(chatMessage);

      //this.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Reset the input field
      this.newMessage = '';

      // Manually trigger change detection if necessary
      this.changeDetectorRef.detectChanges();
    }
  }

  // DISCONNECT
  ngOnDestroy(): void {
    this.chatService.setCurrentActiveChat(null);
    this.chatService.disconnect();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  private scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch (err) {}
  }

  protected readonly window = window;
}
