import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { ToastrModule } from 'ngx-toastr';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    ResetPasswordComponent,

    ForgotPasswordComponent,

    VerifyEmailComponent
  ],
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forChild([
      {
        path:'login',
        component:LoginComponent
      },
      {
        path:'signup',
        component:SignUpComponent
      },
      {
        path:'user/resetPassword',
        component:ResetPasswordComponent
      },
      {
        path:'forgot-password',
        component:ForgotPasswordComponent
      },
      {
        path:'verify-email/:userId',
        component:VerifyEmailComponent
      }
    ])
  ]
})
export class UserModule {


 }
