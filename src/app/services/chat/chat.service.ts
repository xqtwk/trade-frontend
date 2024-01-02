import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Stomp} from "@stomp/stompjs";
import {ChatMessage} from "../../models/chat/chat-message";
import SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private newMessagesMap = new BehaviorSubject<Map<string, boolean>>(new Map());
  currentActiveChat: string | null = null;


  constructor(private http: HttpClient, private userService: UserService) {
  }

  initializeWebSocketConnection(username: string): void {
    const serverUrl = environment.apiUrl + 'ws';
    const token = localStorage.getItem('token');
    //const ws = new SockJS(serverUrl);
    const ws = new SockJS(`${serverUrl}?token=${token}`);
    this.stompClient = Stomp.over(ws);
    this.stompClient.connect({}, () => {
      console.log('Connected to WS');
      this.stompClient.subscribe(`/user/${username}/queue/messages`, (message: any) => {
        if (message.body) {
          const newMessage = JSON.parse(message.body);
          if (newMessage.senderUsername !== username && newMessage.recipientUsername !== this.currentActiveChat) {
            this.addNewMessage(newMessage.senderUsername); // Assuming senderUsername is the chatId
          }
          this.chatMessages.next([...this.chatMessages.value, JSON.parse(message.body)]);
        }
      });
    }, (error: any) => {
      console.log('Error in WS connection:', error);
    });
  }

  sendMessage(chatMessage: ChatMessage): void {
    console.log('Sending message:', chatMessage);
    this.stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.chatMessages.asObservable();
  }

  loadChatMessages(senderUsername: string, recipientUsername: string): void {
    this.http.get<ChatMessage[]>(`${environment.apiUrl}messages/${senderUsername}/${recipientUsername}`)
      .subscribe(messages => {
        this.chatMessages.next(messages);
      });
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }

  getChatList(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}chat-list/${username}`);
  }

  addNewMessage(chatId: string): void {
    const currentMap = this.newMessagesMap.value;
    currentMap.set(chatId, true);
    this.newMessagesMap.next(currentMap);
  }

  // Call this method when a chat is opened/viewed
  markChatAsViewed(chatId: string | null): void {
    if (chatId) {
      const currentMap = this.newMessagesMap.value;
      if (currentMap.has(chatId)) {
        currentMap.set(chatId, false);
      }
      this.newMessagesMap.next(currentMap);
    }
  }
  setCurrentActiveChat(chatId: string | null): void {
    this.currentActiveChat = chatId;
    this.markChatAsViewed(chatId);
  }
  getNewMessagesMap(): Observable<Map<string, boolean>> {
    return this.newMessagesMap.asObservable();
  }

  checkForNewMessages(username: string): boolean {
    let isNewMessage = false;
    const currentMap = this.newMessagesMap.value;

    currentMap.forEach((hasNewMessage, chatId) => {
      if (hasNewMessage && chatId !== this.currentActiveChat && chatId !== this.userService.getUserNicknameFromToken()) {
        isNewMessage = true;
      }
    });

    return isNewMessage;
  }
}
