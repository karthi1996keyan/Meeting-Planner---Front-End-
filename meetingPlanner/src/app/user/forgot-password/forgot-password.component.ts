import { Component, OnInit } from '@angular/core';

import {UserService} from './../../user.service';

import {ToastrService, Toast} from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public email:any;

  constructor(public userService:UserService,
    public toastr:ToastrService) { }

  ngOnInit() {
  }

  public forgotPasswordFunction()
  {
    this.userService.forgotPassword(this.email)
    .subscribe(
      (success)=>
      {
        if(success.status == 200)
        {
          this.toastr.success("Reset password details has been sent to your mail");
        }
        else
        {
          this.toastr.error(success.message);
        }

      }
    )
  }

}
