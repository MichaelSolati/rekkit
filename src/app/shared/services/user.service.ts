import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
// global.localStorage = require('localStorage')
var store = require('store')

@Injectable()
export class UserService {
  private user: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor() {
    this.getCache();
  }

  private getCache() {
    let cachedUser = store.get('user');
    if (cachedUser) {
      this.user.next(cachedUser);
    } else {
      this.user.next(false);
    }
    this.setCache();
  }

  public getUser() {
    return this.user;
  }

  private setCache() {
    this.user.subscribe((user) => {
      store.set('user', user);
    });
  }

  public setUser(user: any) {
    return this.user.next(user);
  }

  public signOut() {
    this.user.next(false);
    return true;
  }
}
