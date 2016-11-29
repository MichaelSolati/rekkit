import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class UserService {
  private user: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor() { }

  public getUser() {
    return this.user;
  }

  public setUser(user: any) {
    return this.user.next(user);
  }
}
