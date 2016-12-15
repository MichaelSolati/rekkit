import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { UserService } from './shared/services/user.service';
import { ActivateGuard } from './shared/services/activate.service';
import { DeactivateGuard } from './shared/services/deactivate.service';

import { AppComponent } from './app.component';
import { appRouting } from './app.routes';
import { LogInComponent } from './log-in/log-in.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { NavigationComponent } from './navigation/navigation.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    HomeComponent,
    PostComponent,
    NavigationComponent,
    CreateThreadComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    appRouting
  ],
  providers: [
    UserService,
    ActivateGuard,
    DeactivateGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
