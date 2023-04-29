import { Component, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from './../../environments/environment';
import { HealthCheckService } from './healthcheck.service';

@Component({
  selector: 'app-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})
export class HealthCheckComponent implements OnInit {

  public result: Observable<Result | null>;

  constructor(private service: HealthCheckService) {
    this.result = this.service.result;
  }

  ngOnInit() {
    this.service.startConnection();
    this.service.addDataListeners();
  }

  onRefresh() {
    this.service.sendClientUpdate();
  }
}

interface Result {
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

