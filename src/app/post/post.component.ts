import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
declare var jQuery: any;

import { UserService } from '../shared/services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {
  private apiUrl: string = environment.apiUrl;
  private thread_id: string = "";
  private posts: Array<any> = [];
  private processing: boolean = false;
  private reply: string = "";
  private threadIdSub: Subscription;
  private user: any = null;
  private userSubscription: Subscription;

  constructor(private route: ActivatedRoute, private http: Http, private userService: UserService) { }

  ngOnInit() {
    this.threadIdSub = this.route.params.subscribe((params: any) => {
      this.thread_id = params.thread_id;
      this.getPosts().subscribe((posts) => {
        this.posts = posts;
      }, (error) =>  {
        console.log(error);
      });
    });

    this.userSubscription = this.userService.getUser().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.threadIdSub.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  private delete(post, thread, username) {
    let r = confirm("Are you sure you want to delete this post?");
    if (r == true) {
      this.deletePost(post, thread, username).subscribe((response) => {
        this.getPosts().subscribe((posts) => {
          this.posts = posts;
        }, (error) =>  {
          alert("Could not delete post...");
        });
      }, (error) =>  {
        console.log(error);
      });
    } else {
      alert("Post not deleted");
    }
  }

  private deletePost(post_id, thread_id, username): Observable<any[]> {
    return this.http.delete(this.apiUrl+`posts?post_id=${post_id}&thread_id=${thread_id}&username=${username}`).map(this.extractData).catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    if (body.error) { throw body.error };
    return body.data || { };
  }

  private handleError (error: Response | any) {
    return Observable.throw(error.code);
  }

  private getPosts(): Observable<any[]> {
    return this.http.get(this.apiUrl+"posts/"+this.thread_id).map(this.extractData).catch(this.handleError);
  }

  private leaveReply () {
    jQuery("#new-reply").modal("show");
  }

  private newPost () {
    this.processing = true;

    if (this.reply.replace(/\s/g, "").length !== 0) {
      let payload = { message: this.reply, thread_id: this.thread_id, created_by: this.user.username };
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });
      this.http.post(this.apiUrl+"posts", payload, options).map(this.extractData).catch(this.handleError).subscribe((response)  => {
        jQuery("#new-reply").modal("hide");
        this.getPosts().subscribe((posts) => {
          this.reply = "";
          this.posts = posts;
        }, (error) =>  {
          alert("Could not refresh posts...");
        });
      }, (error) =>  {
        alert("Could not post your response...");
      });
    } else {
      alert("Your reply is a little too short...");
    }

    this.processing = false;
  }
}
