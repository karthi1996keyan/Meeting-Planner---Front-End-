import { Component, OnInit } from '@angular/core';

import {UserService} from '../../user.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {Cookie} from 'ng2-cookies';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public email:any;
  public password:any;
  constructor(
    public toastr:ToastrService,
    private userService:UserService,
    private Router:Router,
    public location:Location
  ) {   }

  ngOnInit() {

    console.log(Cookie.get('authToken') );
    console.log(Cookie.get('userId'));
    console.log( Cookie.get('userName'));
    console.log(this.userService.getLocalStorage());
    if(Cookie.get('authToken') != null &&
      Cookie.get('userId') != null &&
      Cookie.get('userName') != null &&
      Cookie.get('authToken') != undefined &&
      Cookie.get('userId') != undefined &&
      Cookie.get('userName') != '' &&
      Cookie.get('authToken') != '' &&
      Cookie.get('userId') != '' &&
      Cookie.get('userName') != undefined &&
      this.userService.getLocalStorage()  != null  &&
      this.userService.getLocalStorage() != undefined
        )
        {
          let userDetails=this.userService.getLocalStorage();
          
          if(userDetails.isAdmin === 'true')
          {
            this.goToAdminDashboard();
          }
          else
          {
            this.goToNormalDashboard();
          }
        }

  }

  //got to login starts

  //login function starts
  public loginFunction()
  {
    if(!this.email)
    {
      this.toastr.warning('Email is missing');
    }
    else if(!this.password)
    {
      this.toastr.warning('password is missing');
    }
    else
    {

      let logindata=
      {
        email:this.email,
        password:this.password
      }

      this.userService.login(logindata)
      .subscribe
      (
        (success)=>
        {
          
          if(success.status === 200)
          {
            this.toastr.success('Login Success ');
            Cookie.set('authToken',success.data.authToken);
            Cookie.set('userId',success.data.userDetails.userId);
            Cookie.set('userName',success.data.userDetails.userName);
            this.userService.setLocalStorage(success.data.userDetails);
            setTimeout(()=>
            {
                if(success.data.userDetails.isAdmin === 'true')
                {
                  this.goToAdminDashboard();
                }
                else
                {
                  this.goToNormalDashboard();
                }
            },3000);

          }
          else
          {
            this.toastr.error(success.message);
          }
        },
        (error)=>
        {
          if(error.status == 404)
          {

            this.toastr.warning("Login Failed", "User Not Found!");
            
            this.Router.navigate(['/error']);
          }
          else if(error.status == 400)
          {
            this.toastr.warning("Login Failed", "Wrong password");
          }
          else
          {
            this.toastr.warning("Login Failed", "Some error occured");
            this.Router.navigate(['/error']);
          }
        }
      )
    }
  }

  public goToAdminDashboard=()=>
  {

    this.Router.navigate(['/admin-dashboard']);

  }

  public goToForgotPasswordFunction()
  {

    this.Router.navigate(['/forgot-password']);

  }

  public goToNormalDashboard=()=>
  {

    this.Router.navigate(['/user-dashboard/meeting']);

  }
  public loginUsingKeypress: any = (event: any) => {

    if (event.keyCode === 13) { // 13 is keycode of enter.

      this.loginFunction();

    }
  }

}
