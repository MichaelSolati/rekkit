import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private apiUrl: string = environment.apiUrl;
  private threads: Array<any> = [];
  constructor(private http: Http) { }

  ngOnInit() {
    this.getThreads().subscribe((threads) => {
      this.threads = threads
    }, (error) =>  {
      console.log(error);
    });
  }

  private getThreads(): Observable<any[]> {
    return this.http.get(this.apiUrl+"threads").map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    if (body.error) { throw body.error };
    return body.data || { };
  }

  private handleError (error: Response | any) {
    return Observable.throw(error.code);
  }
}
