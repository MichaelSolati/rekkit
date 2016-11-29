import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  private posts: Array<any> = [];
  constructor() {
    for (let i = 0; i < 10; i++) {
      this.posts.push(this.makeDummyReply());
    }
  }

  ngOnInit() {
  }

  private makeDummyReply() {
    return {
      _id: String(Math.floor(Math.random()*256000)),
      post_id: String(Math.floor(Math.random()*256000)),
      message: "Spicy jalapeno bacon ipsum dolor amet swine bacon picanha excepteur, prosciutto beef consequat aliqua ullamco meatloaf et voluptate dolore. Sirloin ut turkey pork, do laborum capicola voluptate dolore prosciutto filet mignon anim shoulder boudin. Pariatur picanha aute nulla jowl flank short ribs dolor cupim, in magna hamburger sausage ham hock strip steak. Leberkas fugiat consequat, alcatra biltong pork chop labore velit irure. Meatball turducken nulla, brisket flank pariatur ullamco cillum beef ribs pork loin doner jowl ea sausage.",
      postedBy: "Michael Solati",
      poster_id: String(Math.floor(Math.random()*256000)),
      postedOn: new Date()
    }
  }
}
