import { Component, OnInit, OnDestroy } from '@angular/core';
import { Client } from '@stomp/stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  stock: any = {}

  webSocket?: WebSocket;
  client?: Client;

  constructor() { }

  ngOnInit() {
    this.openWebSocketConnection();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  openWebSocketConnection() {
    this.client = new Client({ brokerURL: "ws://localhost:8080/connect", debug: (msg) => console.log(msg) });
    this.client.onConnect = () => {
      this.client?.subscribe("/topic/stocks", (payload) => {
        console.log("Got something")
        this.updateStocks(JSON.parse(JSON.parse(payload.body).payload));
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

  updateStocks(stock: any) {
    this.stock = stock
  }

  onBuyStock() {
    var payload = { user: "John Doe" }
    this.client?.publish({ destination: "/app/button", body: JSON.stringify(payload) });
  }
}
