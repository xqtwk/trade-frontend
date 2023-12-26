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
  private tradeErrors: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private http: HttpClient, private userService: UserService) {}

  getTradeList(): Observable<TradeResponse[]> {
    return this.http.get<TradeResponse[]>(`${environment.apiUrl}trade-list`);
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
      this.subscribeToTradeErrors(username);
    }, (error: any) => {
      console.log('Error in WS connection:', error);
    });
  }

  private subscribeToTrade(username: string): void {
    // Use the actual username dynamically here
    const tradeDestination = `/user/${username}/queue/trade`;

    this.stompClient.subscribe(tradeDestination, (message: any) => {
      console.log("Received trade update:", message); // Debugging log
      if (message.body) {
        const tradeUpdate = JSON.parse(message.body);
        console.log("Parsed trade update:", tradeUpdate); // Debugging log
        this.tradeUpdates.next(tradeUpdate);
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
          // Parse the received message body
          const tradeId = message.body.replace(/"/g, '');
          observer.next(tradeId);
          observer.complete();
        }
      });
    });
  }
  private subscribeToTradeErrors(username: string): void {
    const errorDestination = `/user/${username}/queue/errors`;

    this.stompClient.subscribe(errorDestination, (message: any) => {
      if (message.body) {
        this.tradeErrors.next(message.body);
      }
    });
  }
  getTradeErrors(): Observable<string> {
    return this.tradeErrors.asObservable();
  }
  confirmTrade(tradeId: string, username: string): void {
    this.stompClient.send('/app/trade/confirm', {}, JSON.stringify({ tradeId, username }));
  }
  cancelTrade(tradeId: string, username: string): void {
    this.stompClient.send('/app/trade/cancel', {}, JSON.stringify({ tradeId, username }));
  }
  getTradeUpdates(): Observable<any> {
    return this.tradeUpdates.asObservable();
  }

  disconnect(): void {
    if (this.stompClient !== null) {
      this.tradeErrors = new BehaviorSubject<string>('');
      this.stompClient.disconnect();
    }
  }
}
