import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';

import { UserService } from './user.service';

@Injectable()
export class ActivateGuard implements CanActivate {
  private user: any = null;
  private userSubscription: Subscription;

  constructor(private router: Router, private userService: UserService) {
    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }
  canActivate() {
    if (this.user) {
      return true;
    }
    this.router.navigate(["/"]);
    return false;
  }
}
