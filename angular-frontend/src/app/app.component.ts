import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpService } from 'src/http.service';
import * as Stomp from 'stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  stock : any = {}

  webSocket?: WebSocket;
  client?: Stomp.Client;

  constructor() { }

  ngOnInit() {
    this.openWebSocketConnection();
  }

  ngOnDestroy(): void {
    this.closeWebSocketConnection();
  }

  openWebSocketConnection() {
    this.webSocket = new HttpService().getWebSocket();
    this.client = Stomp.over(this.webSocket);
    this.client.connect({}, () => {
      this.client?.subscribe("/stocks", (payload) => {
        this.updateStocks(JSON.parse(payload.body));
      });
    });
  }

  closeWebSocketConnection() {
    if (this.client && this.webSocket) {
      this.webSocket.close();
      this.client.unsubscribe("/item-updates");
    }
  }

  updateStocks(stock: any) {
    this.stock = stock
  }

  onBuyStock() {
    var payload= { user: "John Doe" }
    this.client?.send("/button", {}, JSON.stringify(payload));
  }
}
