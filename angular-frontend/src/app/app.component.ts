import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stock : any = {
  }

  private stockSocket: WebSocket
  private buttonSocket: WebSocket

  constructor() {
    this.stockSocket = new WebSocket("ws://localhost:8080/stocks")
    this.buttonSocket = new WebSocket("ws://localhost:8080/button")
    this.stockSocket.onmessage = (event) => {
      this.stock = JSON.parse(event.data)
    }
  }

  onBuyStock() {
    var payload= { user: "John Doe" }

    this.buttonSocket.send(JSON.stringify(payload));
  }
}
