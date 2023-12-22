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
  private tradeUpdates: BehaviorSubject<any> = new BehaviorSubject<any>(null);

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

  private subscribeToTrade(username: string): void {
    // Use the actual username dynamically here
    const tradeDestination = `/user/${username}/queue/trade`;

    this.stompClient.subscribe(tradeDestination, (message: any) => {
      if (message.body) {
        this.tradeUpdates.next(JSON.parse(message.body));
      }
    });
  }

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

  getTradeUpdates(): Observable<any> {
    return this.tradeUpdates.asObservable();
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
  }
}
