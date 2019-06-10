import { Component, OnInit } from '@angular/core';
 
import {UserService} from './../../user.service';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute,Router} from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {


  public password:any;
  public retypepassword:any;
  public authToken:any;
  constructor(public userService:UserService,
    public toastr:ToastrService,
    public route:ActivatedRoute,
    public _route:Router) { }

  ngOnInit() {
    this.authToken=this.route.snapshot.queryParamMap.get('authToken');
  }

  public resetPasswordFunction()
  {
    if(!this.password)
    {
      
      this.toastr.warning('Password is missing');
    }
    else if(!this.retypepassword)
    {

      this.toastr.warning('Password is missing');
    }
    else if(this.password != this.retypepassword)
    {

      this.toastr.warning('Password mismatch');
    }
    else
    {
      let data=
      {
        validationToken:this.authToken,
        password:this.password
      }
      this.userService.updatePassword(data)
      .subscribe(
        (success)=>
        {
            if(success.status == 200)
            {
              this.toastr.success('Password changed successfully');
              setTimeout(
                ()=>
                {
                  this._route.navigate(['/login']);

                },2000
              )
            }
            else
            {
              this.toastr.error(success.message);
            }
        },
        (error)=>
        {

        }
      )

    }
  }

}
