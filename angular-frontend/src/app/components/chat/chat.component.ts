import { Component, ElementRef, Input, OnDestroy, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';

import { Client } from '@stomp/stompjs';
import { ChatMessage, User } from 'src/model';

interface MessageGroup {
  user: User,
  messages: ChatMessage[]
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {

  @Input() client!: Client;
  @Input() currentUser!: String;

  @ViewChild("chatMessageBox") chatMessageBox!: ElementRef;
  
  messages: MessageGroup[] = [];
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

    const lastMessageGroup = this.messages[this.messages.length - 1];

    if (!!lastMessageGroup && lastMessageGroup.user.name === newMessage.user.name) {
      lastMessageGroup.messages.push(newMessage);
    } else {
      this.messages.push({user: newMessage.user, messages: [newMessage]});
    }
  }

  sendMessage() {
    const text = this.messageText
    if (text !== "") {
      const payload = JSON.stringify({text: text, clientTimestamp: new Date()});
      this.client.publish({destination: "/app/chat", body: payload});
      this.messageText = "";
      this.chatMessageBox.nativeElement.focus();
    }
  }

}
