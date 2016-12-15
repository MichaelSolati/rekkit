import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
var store = require('store')

import { environment } from '../../../environments/environment';

@Injectable()
export class UserService {
  private apiUrl: string = environment.apiUrl;
  private user: BehaviorSubject<any> = new BehaviorSubject<any>(false);

  constructor(private http: Http) {
    this.getCache();
  }

  private extractData(res: Response) {
    let body = res.json();
    if (body.error) { throw body.error };
    return body.data || { };
  }

  private handleError (error: Response | any) {
    return Observable.throw(error.code);
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

  public signIn(signInForm: any, callback?: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.apiUrl+"users/sign-in", signInForm, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
      this.setUser(response);
      callback(null, response);
    }, (error) =>  {
      callback(error, null);
    })
  }

  public signUp(signInForm: any, callback?: any) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.http.post(this.apiUrl+"users/sign-up", signInForm, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
      callback(null, response)
    }, (error) =>  {
      callback(error, null);
    })
  }

  public signOut() {
    this.user.next(false);
    return true;
  }
}
