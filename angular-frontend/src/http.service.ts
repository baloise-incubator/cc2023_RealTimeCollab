import { Credentials } from "./model";
import { environment } from "./environments/environment";

export class HttpService {
  host: String;
  protocol: String;

  constructor() {
    this.host = environment.backend.host;
    this.protocol = environment.backend.protocol;
  }

  getWebSocket(credentials: Credentials): WebSocket {
    console.log("Create web socket to: '" + this.host + "'");
    return new WebSocket(`${this.protocol}://${credentials.username}:${credentials.passcode}@${this.host}/connect`);
  }
}