import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as signalR from "@microsoft/signalr";

import { environment } from './../../environments/environment';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  private hubConnection!: signalR.HubConnection;
  private _results: Subject<Result[]> = new Subject<Result[]>();
  private _arrayResults: Result[] = [];
  public results = this._results.asObservable();

  constructor(private http: HttpClient) {
  }

  public async startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(environment.baseUrl + 'api/health-hub', { withCredentials: false })
      .build();

    console.log("Starting connection...");
    await this.hubConnection
      .start()
      .then(() => console.log("Connection started."))
      .catch((err: any) => console.log(err));

    this.updateData();
  }

  public addDataListeners() {
    this.hubConnection.on('Update', (msg) => {
      console.log("Update issued by server for the following reason: " + msg);
      this.updateData();
    });

    this.hubConnection.on('ClientUpdate', (msg) => {
      console.log("Update issued by client for the following reason: " + msg);
      this.updateData();
    });
  }

  public updateData() {
    console.log("Fetching data...");
    this.http.get<Result>(environment.baseUrl + 'api/health')
      .subscribe(r => {
        //this._result.next(result);
        this._arrayResults.push(r);
        this._results.next(this._arrayResults);
        console.log(r);
      });
  }

  public sendClientUpdate() {
    this.hubConnection.invoke('ClientUpdate', 'client test')
      .catch(err => console.error(err));
  }
}

export interface Result {
  checks: Check[];
  totalStatus: string;
  totalResponseTime: number;
}

interface Check {
  name: string;
  responseTime: number;
  status: string;
  description: string;
}
