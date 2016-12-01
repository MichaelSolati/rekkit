import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../environments/environment';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.component.html',
  styleUrls: ['./create-thread.component.css']
})
export class CreateThreadComponent implements OnInit, OnDestroy {
  private apiUrl: string = environment.apiUrl;
  private processing: boolean = false;
  private threadForm: any = {
    title: "",
    created_by: ""
  }
  private userSubscription: Subscription;

  constructor (private http: Http, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      if (user && user.username) {
        this.threadForm.created_by = user.username;
      } else {
        this.threadForm.created_by = "";
      }
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  private createThread(threadForm: any) {
    this.processing = true;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.apiUrl+"threads", threadForm, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
      this.router.navigate(["/post", response]);
    }, (error) =>  {
      alert(error);
      this.processing = false;
    })
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
