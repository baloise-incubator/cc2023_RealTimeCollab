import { Credentials } from "./model";
import { environment } from "./environments/environment";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {Injectable} from "@angular/core";

@Injectable()
export class HttpService {
  host: String;
  protocol: String;

  constructor(private http: HttpClient) {
    this.host = environment.backend.host;
    this.protocol = environment.backend.protocol;
  }

  getWebSocket(credentials: Credentials): WebSocket {
    console.log("Create web socket to: '" + this.host + "'");
    return new WebSocket(`${this.protocol}://${credentials.username}:${credentials.password}@${this.host}/api/connect`);
  }

  getRegistrationURL(credentials : Credentials) : Observable<boolean> {
    return this.http.post<boolean>(`http://${this.host}/api/user/registration`, credentials)
  }

}