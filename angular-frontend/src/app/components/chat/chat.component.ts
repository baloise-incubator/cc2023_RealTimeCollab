import { Component, Input } from '@angular/core';

import { Client } from '@stomp/stompjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  @Input() client!: Client;
  @Input() currentUser!: String;

}
