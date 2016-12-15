import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private apiUrl: string = environment.apiUrl;
  private profile: {is_admin?: number; name?: string; username?: string; threads?: Array<any>;};
  private profileSubscription: Subscription;

  constructor(private route: ActivatedRoute, private http: Http) { }

  ngOnInit() {
    this.profileSubscription = this.route.params.subscribe((params: any) => {
      let username = params.username;
      this.getProfile(username).subscribe((profile) => {
        this.profile = profile;
      }, (error) =>  {
        console.log(error);
      });
    });
  }

  ngOnDestroy() {
    this.profileSubscription.unsubscribe();
  }

  private extractData(res: Response) {
    let body = res.json();
    if (body.error) { throw body.error };
    return body.data || { };
  }

  private getProfile(username: string): Observable<any[]> {
    return this.http.get(this.apiUrl+"profile/"+username).map(this.extractData).catch(this.handleError);
  }

  private handleError (error: Response | any) {
    return Observable.throw(error.code);
  }
}
