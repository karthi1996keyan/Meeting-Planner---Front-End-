import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import {AdminComponent} from './admin/admin.component';
import {UserComponent} from './user/user.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [UserComponent,AdminComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    RouterModule.forChild([
      {
        path:'admin-dashboard/user-meeting/:userId',
        component:AdminComponent
      },
      {
        path:'user-dashboard/meeting',
        component:UserComponent
      }
    ]),
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),

  ]
})
export class CalenderModule { }
