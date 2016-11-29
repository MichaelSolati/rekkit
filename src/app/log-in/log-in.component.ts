import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from '../shared/services/user.service';

var baconipsum = require('baconipsum');

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  private bacon: Array<string> = [];

  private isSigningIn: boolean = true;

  private user:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  private signInForm: any = {
    username:"",
    password:"",
    name: ""
  }

  private userAPI: string = "https://rekkit.herokuapp.com/api/users";

  constructor (private http: Http, private router: Router, private userService: UserService) {
    this.user = this.userService.getUser();

    this.bacon.push(baconipsum(15));
    this.bacon.push(baconipsum(15));
    this.bacon.push(baconipsum(15));
  }

  ngOnInit() {
    this.user.subscribe(res => console.log(res));
  }

  private handleError (error: Response) {
    console.log(error.json())
    return Observable.throw(error.json().error || ' error');
  }

  private signIn() {
    // Meteor.loginWithPassword(this.signInForm.email, this.signInForm.password, (error, success) => {
    //   if (error) {
    //     Bert.alert("Could not sign in: "+error.reason, "danger", "growl-top-right");
    //   } else {
    //     Bert.alert("Welcome Back!", "success", "growl-top-right");
    //     this.router.navigate(["my-account"]);
    //   }
    // })
  }

  private signUp() {
    var data = `username=${this.signInForm.username}&password=${this.signInForm.password}&name=${this.signInForm.name}`;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", this.userAPI);
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");

    xhr.send(data);
  }

  private submit() {
    if (this.isSigningIn) {
      this.signIn();
    } else {
      this.signUp();
    }
  }

  private toggleSignIn() {
    this.isSigningIn = !this.isSigningIn;
  }
}
