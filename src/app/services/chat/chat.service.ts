import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Stomp} from "@stomp/stompjs";
import {ChatMessage} from "../../models/chat-message";
import SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient: any;
  private chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);


  constructor(private http: HttpClient) {
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
}
