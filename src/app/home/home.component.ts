import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../environments/environment';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private apiUrl: string = environment.apiUrl;
  private threads: Array<any> = [];
  private user: any = null;
  private userSubscription: Subscription;
  constructor(private http: Http, private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });

    this.getThreads().subscribe((threads) => {
      this.threads = threads;
    }, (error) =>  { });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  private delete(thread, username) {
    let r = confirm("Are you sure you want to delete this thread?");
    if (r == true) {
      this.deleteThread(thread, username).subscribe((response) => {
        this.getThreads().subscribe((threads) => {
          this.threads = threads;
        }, (error) =>  { });
      }, (error) =>  {
        console.log(error);
      });
    } else {
      alert("Thread not deleted");
    }
  }

  private deleteThread(thread_id, username): Observable<any[]> {
    return this.http.delete(this.apiUrl+`threads?thread_id=${thread_id}&username=${username}`).map(this.extractData).catch(this.handleError);
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
