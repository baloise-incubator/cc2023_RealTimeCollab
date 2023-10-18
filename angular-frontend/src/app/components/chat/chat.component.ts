import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";
import { BalButton, BalIcon, BalInput } from '@baloise/design-system-components-angular';

import { BalValidators } from "@baloise/web-app-validators-angular";

import { Client } from '@stomp/stompjs';
import { ChatMessage } from 'src/model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() client!: Client;
  @Input() currentUser!: String;

  @ViewChild("chatMessageBox") chatMessageBox!: ElementRef;

  messages: ChatMessage[] = [];
  messageText = "";

  ngOnInit(): void {
    if (this.client.connected) {
      this.client.subscribe("/topic/chat", payload => this.addMessage(payload));
    }
  }

  ngOnDestroy(): void {
    if (this.client.connected) {
      this.client.unsubscribe("/topic/chat")
    }
  }

  addMessage(payload: any) {
    const newMessage = JSON.parse(payload.body) as ChatMessage;
    newMessage.timestamp = new Date(newMessage.timestamp);
    console.log(newMessage);
    this.messages.push(newMessage);
  }

  sendMessage() {
    const text = this.messageText
    if (text !== "") {
      const payload = JSON.stringify({text: text, clientTimestamp: new Date()});
      console.log(payload);
      this.client.publish({destination: "/app/chat", body: payload});
      this.messageText = "";
      this.chatMessageBox.nativeElement.focus();
    }
  }

}
