import { Credentials } from "./model";

export class HttpService {
  host = "localhost";
  port = 8080;

  constructor() {}

  getWebSocket(credentials: Credentials): WebSocket {

    return new WebSocket(`ws://${credentials.username}:${credentials.passcode}@${this.host}:${this.port}/connect`);
  }
}