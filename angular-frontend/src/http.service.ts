import { Credentials } from "./model";
import { environment } from "./environments/environment";

export class HttpService {
  host: String;
  port: number;

  constructor() {
    this.host = environment.backend.host;
    this.port = environment.backend.port;
  }

  getWebSocket(credentials: Credentials): WebSocket {
    console.log("Create web socket to: '" + this.host + ":" + this.port + "'");
    return new WebSocket(`ws://${credentials.username}:${credentials.passcode}@${this.host}:${this.port}/connect`);
  }
}