import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { environment } from '../../environments/environment';
import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  private apiUrl: string = environment.apiUrl;
  private isSigningIn: boolean = true;
  private processing: boolean = false;
  private signInForm: any = {
    username:"",
    password:"",
    name: ""
  }

  constructor (private http: Http, private router: Router, private userService: UserService) { }

  private signIn(signInForm: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.apiUrl+"users/sign-in", signInForm, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
      this.userService.setUser(response);
      this.router.navigate(["/"]);
    }, (error) =>  {
      alert(error);
      this.processing = false;
    })
  }

  private signUp(signInForm: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.apiUrl+"users/sign-up", signInForm, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
      this.signIn(signInForm);
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

  private submit(signInForm: any) {
    this.processing = true;
    if (this.isSigningIn) {
      this.signIn(signInForm);
    } else {
      this.signUp(signInForm);
    }
  }

  private toggleSignIn() {
    this.isSigningIn = !this.isSigningIn;
  }
}
