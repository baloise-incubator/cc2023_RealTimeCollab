import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import {Button, Stock} from "../model";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  stock?: Stock
  client: Client;

  constructor() {
    this.client = new Client({ brokerURL: "ws://localhost:8080/connect" });
  }

  ngOnInit() {
    this.openWebSocketConnection();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  openWebSocketConnection() {
    this.client.onConnect = () => {
      this.client?.subscribe("/topic/stocks", (payload) => {
        this.updateStocks(JSON.parse(payload.body) as Stock);
      });
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

  updateStocks(stock: Stock) {
    this.stock = stock;
  }

  onBuyStock() {
    const payload = { user: "John Doe" } as Button
    this.client?.publish({ destination: "/app/button", body: JSON.stringify(payload) });
  }
}
