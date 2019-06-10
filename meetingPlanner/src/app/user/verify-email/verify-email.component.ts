import { Component, OnInit } from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from './../../user.service';

import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

  public message:any;
  public userId:any;
  constructor(public route:ActivatedRoute,
    public useService:UserService,
    public toastr:ToastrService,
    public router:Router) { }

  ngOnInit() {
    this.userId=this.route.snapshot.paramMap.get('userId');
    this.verifyEmail();
  } 

  public verifyEmail()
  {
    this.useService.verifyEmail(this.userId)
    .subscribe(
      (success)=>
    {
      console.log(success);
        this.message=success.message;
        if(success.status == 200 )
        {
          this.toastr.success('User Verified successfully');
          setTimeout(() => {
            
          this.router.navigate(['/login']);
          }, 3000);
        }
        else
        {
          
          this.toastr.error(this.message);
          setTimeout(() => {
            
          this.router.navigate(['/error']);
          }, 3000);

        }
        
    });
    
    ;
  }

}
