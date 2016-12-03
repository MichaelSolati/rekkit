import { Routes, RouterModule } from '@angular/router';

import { ActivateGuard } from './shared/services/activate.service';
import { DeactivateGuard } from './shared/services/deactivate.service';

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
      component: LogInComponent,
    canActivate: [DeactivateGuard]
  }, {
    path: 'thread/:thread_id',
    component: PostComponent
  }, {
      path: 'new-thread',
      component: CreateThreadComponent,
    canActivate: [ActivateGuard]
  }]
}];

export const appRouting = RouterModule.forRoot(appRoutes);
