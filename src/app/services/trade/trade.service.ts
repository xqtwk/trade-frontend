import { Injectable } from '@angular/core';
import SockJS from "sockjs-client";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {UserService} from "../user/user.service";
import {BehaviorSubject, Observable} from "rxjs";
import {Stomp} from "@stomp/stompjs";
import {ChatMessage} from "../../models/chat/chat-message";
import {TradeResponse} from "../../models/trade/trade-response";
@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private stompClient: any;
  private chatMessages: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private tradeUpdates: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentActiveChat: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {}

  getTradeList(username: string): Observable<TradeResponse[]> {
    return this.http.get<TradeResponse[]>(`${environment.apiUrl}trade-list/${username}`);
  }
  getTradeDetails(tradeId: number): Observable<TradeResponse> {
    return this.http.get<TradeResponse>(`${environment.apiUrl}trade/${tradeId}`);
  }
  initializeWebSocketConnection(username: string): void {
    const serverUrl = environment.apiUrl + 'ws';
    const token = localStorage.getItem('token');
    const ws = new SockJS(`${serverUrl}?token=${token}`);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, () => {
      console.log('Connected to WS');
      //this.subscribeToChat(username);
      this.subscribeToTrade(username);
    }, (error: any) => {
      console.log('Error in WS connection:', error);
    });
  }

  private subscribeToChat(username: string): void {
    this.stompClient.subscribe(`/user/${username}/queue/messages`, (message: any) => {
      if (message.body) {
        this.chatMessages.next([...this.chatMessages.value, JSON.parse(message.body)]);
      }
    });
  }

  private subscribeToTrade(username: string): void {
    // Use the actual username dynamically here
    const tradeDestination = `/user/${username}/queue/trade`;

    this.stompClient.subscribe(tradeDestination, (message: any) => {
      if (message.body) {
        this.tradeUpdates.next(JSON.parse(message.body));
      }
    });
  }

  sendMessage(chatMessage: ChatMessage): void {
    this.stompClient.send('/app/chat', {}, JSON.stringify(chatMessage));
  }

/*  initiateTrade(tradeRequest: any): Observable<string> {
    return new Observable<string>((observer) => {
      this.stompClient.send('/app/trade/initiate', {}, JSON.stringify(tradeRequest));
      setTimeout(() => {
        const tradeId = '12345'; // Replace with the actual trade ID when received from the server
        observer.next(tradeId);
        observer.complete();
      }, 1000); // Simulating a delay for the response
    });
  }*/
  initiateTrade(tradeRequest: any): Observable<string> {
    const tradeRequestData = JSON.stringify(tradeRequest);

    // Send the trade request to the server
    this.stompClient.send('/app/trade/initiate', {}, tradeRequestData);

    // Return an Observable that captures the trade ID from the server response
    return new Observable<string>((observer) => {
      // Subscribe to trade initiation response from the server
      this.stompClient.subscribe(`/user/${this.userService.getUserNicknameFromToken()}/queue/trade-initiation`, (message: any) => {
        if (message.body) {
          const tradeId = JSON.parse(message.body).tradeId; // Extract the trade ID from the response
          observer.next(tradeId);
          observer.complete();
        }
      });
    });
  }

  confirmTrade(tradeId: string, username: string): void {
    this.stompClient.send('/app/trade/confirm', {}, JSON.stringify({ tradeId, username }));
  }

  getMessages(): Observable<ChatMessage[]> {
    return this.chatMessages.asObservable();
  }

  getTradeUpdates(): Observable<any> {
    return this.tradeUpdates.asObservable();
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}
