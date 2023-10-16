export class HttpService {
  constructor() {}

  getWebSocket(): WebSocket {
    return new WebSocket("ws://localhost:8080/connect");
  }
}