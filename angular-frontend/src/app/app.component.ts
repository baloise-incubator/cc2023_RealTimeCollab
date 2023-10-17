import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import {Button, Credentials, Stock, User} from "../model";
import { HttpService } from 'src/http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  stock?: Stock;
  client: Client;
  httpService: HttpService;
  users: User[] = []

  constructor() {
    this.httpService = new HttpService();
    this.client = new Client();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  openWebSocketConnection(credentials : Credentials) {
    this.client.configure({
      debug: (msg) => console.log(msg),
      webSocketFactory: () => this.httpService.getWebSocket(credentials)
     })

    this.client.onConnect = () => {
      this.client.subscribe("/topic/stocks", (payload) => this.updateStocks(JSON.parse(payload.body) as Stock));
      this.client.subscribe("/topic/activeUsers", (payload) => this.users = JSON.parse(payload.body));
    };

    this.client.onWebSocketError = (error) => {
      console.error('Error with websocket', error);
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };
    this.client.activate();
  }

  closeWebSocketConnection() {
    if (this.client) {
      this.client.unsubscribe("/topic/stocks");
      this.client.deactivate();
    }
  }

  onConnectToBackend(credentials: Credentials) {
    console.log(credentials);
    this.openWebSocketConnection(credentials)
  }

  updateStocks(stock: Stock) {
    this.stock = stock;
  }

  onBuyStock() {
    const payload = { user: "John Doe" } as Button
    this.client?.publish({ destination: "/app/button", body: JSON.stringify(payload) });
  }
}
