import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent {
  private isSigningIn: boolean = true;
  private processing: boolean = false;
  private signInForm: any = {
    username:"",
    password:"",
    name: ""
  }

  constructor (private router: Router, private userService: UserService) { }

  private signIn(signInForm: any) {
    this.userService.signIn(signInForm, (error, success) => {
      if (error) {
        alert(error);
        this.processing = false;
      } else {
        console.log(success);
        this.router.navigate(["/"]);
      }
    });
  }

  private signUp(signInForm: any) {
    this.userService.signUp(signInForm, (error, success) => {
      if (error) {
        alert(error);
        this.processing = false;
      } else {
        this.signIn(signInForm);
      }
    });
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
