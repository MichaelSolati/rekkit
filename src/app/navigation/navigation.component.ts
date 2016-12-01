import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

import { UserService } from '../shared/services/user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {
  private user: any = null;
  private userSubscription: Subscription;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  private signOut() {
    if (this.userService.signOut()) {
      this.router.navigate(["/"]);
    }
  }

}
