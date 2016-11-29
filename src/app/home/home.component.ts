import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private threads: Array<any> = [];
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.threads.push(this.makeDummyThread());
    }
  }

  ngOnInit() {
  }

  private makeDummyThread() {
    return {
      _id: String(Math.floor(Math.random()*256000)),
      title: "Welcome to the jungle!",
      postedBy: "Michael Solati",
      postedOn: new Date()
    }
  }
}
