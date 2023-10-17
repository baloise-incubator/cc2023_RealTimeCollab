import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';
import {Button, Credentials, Cursor, Stock, User} from "../model";
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
  currentUser = ""
  cursors: Cursor[] = []

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
      this.client.subscribe("/app/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/activeUsers", (payload) => this.updateUsers(JSON.parse(payload.body)));
      this.client.subscribe("/topic/cursor", (payload => this.updateCursors(JSON.parse(payload.body))));
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
    this.openWebSocketConnection(credentials);
    this.currentUser = credentials.username;
  }

  updateStocks(stock: Stock) {
    this.stock = stock;
  }

  onBuyStock() {
    const payload = { user: "John Doe" } as Button
    this.client?.publish({ destination: "/app/button", body: JSON.stringify(payload) });
  }

  mouseMoved(event: MouseEvent) {
    const payload = {posX: event.pageX, posY: event.pageY};
    this.client?.publish({ destination: "/app/cursor", body: JSON.stringify(payload)});
  }

  updateCursors(newPosition: Cursor) {
    if (this.currentUser === newPosition.name) {
      return
    }
    const currentCursor = this.cursors.findIndex((cursor) => cursor.name === newPosition.name);

    if (currentCursor === -1) {
      this.cursors.push(newPosition);
    } else {
      this.cursors[currentCursor] = newPosition;
    }
  }

  updateUsers(users: User[]) {
    this.users = users;
    this.cursors = this.cursors.filter(cursor => users.find(user => user.name === cursor.name));
  }
}
