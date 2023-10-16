export class HttpService {
    getWebSocket(): WebSocket {
      return new WebSocket("ws://localhost:8080/websocket");
    }
}