import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import {UserModule} from '../app/user/user.module';

import { FormsModule , ReactiveFormsModule } from '@angular/forms';
 import {UserService} from './user.service';
 import {MeetingService} from './meeting.service';
import {HttpClientModule} from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';
import {CalenderModule} from './calender/calender.module';
import { NotFoundPageComponent } from './not-found-page/not-found-page.component';
import { ErrorComponent } from './error-page/error/error.component';
import {SocketService} from './socket.service';
import { CookieService } from 'ngx-cookie-service';
@NgModule({
  declarations: [
    AppComponent,
    NotFoundPageComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    DashboardModule,
    CalenderModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      
      {
        path:'pageNotFound',
        component:NotFoundPageComponent
      },
      {
        path:'error',
        component:ErrorComponent
      },
      {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
      },
      {
        path:'*',
        redirectTo:'pageNotFound'
      },
      {
        path:'**',
        redirectTo:'pageNotFound'
      }
      
    ])
  ],providers: [UserService,MeetingService,CookieService,SocketService]
  ,
  bootstrap: [AppComponent]
})
export class AppModule { }
