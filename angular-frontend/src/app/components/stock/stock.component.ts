import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Button, Stock } from '../../../model';
import { Client } from '@stomp/stompjs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit, OnDestroy {

  @Input() client!: Client;
  stock!: Stock;

  ngOnInit(): void {
    if (this.client.connected) {
      this.client.subscribe("/topic/stocks", (payload) => this.updateStocks(JSON.parse(payload.body) as Stock));
    }
  }

  ngOnDestroy(): void {
    if (this.client.connected) {
      this.client.unsubscribe("/topic/stocks");
    }
  }

  updateStocks(stock: Stock) {
    this.stock = stock;
  }

  onBuyStock() {
    const payload = { user: "John Doe" } as Button;
    this.client?.publish({ destination: "/app/button", body: JSON.stringify(payload) });
  }

}
