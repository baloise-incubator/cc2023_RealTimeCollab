import { Credentials } from "./model";
import { environment } from "./environments/environment";

export class HttpService {
  host: String;

  constructor() {
    this.host = environment.backend.host;
  }

  getWebSocket(credentials: Credentials): WebSocket {
    console.log("Create web socket to: '" + this.host + "'");
    return new WebSocket(`ws://${credentials.username}:${credentials.passcode}@${this.host}/connect`);
  }
}