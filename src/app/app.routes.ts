import { Routes, RouterModule } from '@angular/router';

import { NavigationComponent } from './navigation/navigation.component';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';

const appRoutes: Routes = [{
  path: '',
  component: NavigationComponent,
  children: [{
      path: '',
      component: HomeComponent
  }, {
      path: 'log-in',
      component: LogInComponent
  }, {
    path: 'post/:post',
    component: PostComponent
  }, {
      path: 'create-thread',
      component: CreateThreadComponent
  }]
}];

export const appRouting = RouterModule.forRoot(appRoutes);
