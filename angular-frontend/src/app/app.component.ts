import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  stock : any = {
    name: "Baloise",
    price: 128.40,
    increased: true,
    icon: "https://dwglogo.com/wp-content/uploads/2017/10/1200px-Baloise_logo-1024x705.png"
  }
}
