import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  private signInForm: any = {
    email:"",
    password:"",
    profile: {
      name: ""
    }
  }
  private isSigningIn: boolean = true;
  constructor() { }

  ngOnInit() {
  }
  private signIn() {
    console.log("Signed In");
  }

  private signOut() {
    console.log("Signed Out");
  }

  private signUp() {
    console.log("Signed Up");
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
