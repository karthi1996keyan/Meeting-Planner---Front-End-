import { Component, OnInit } from '@angular/core';

import { ToastrService} from 'ngx-toastr';
import {UserService} from '../../user.service';

import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public firstName:any;
  public lastName:any;
  public userName:any;
  public countryName:any;
  public mobileNumber:any;
  public email:any;
  public password:any;
  public isAdmin:any;
  public adminPattern:any;

  public country:any;

  public allCountryCodes:any;
  public allCountryNames:any;
  public countryCode:any;
  public countryNames:any[]=[];
  constructor(public toastr:ToastrService,
    private userService:UserService,
    private router:Router) { }

  ngOnInit() {
    this.getCountryNames();
    this.getCountryNumbers();
    this.isAdmin=false;
  }

  public onclickCountryCode()
  {

    this.countryCode=this.allCountryCodes[this.countryName];
   
  }
  
  public changeIsAdminValue(data:any)
  {
    this.isAdmin=data;

  }
  
  //check user name if its admin access

  public validateUserName(name:String):boolean
  {
      if(name.substr(name.length-6,name.length-1) == '-Admin')
      {
        return true;
      }
      else 
      {
        return false;
      }
  }

  public getCountryNumbers() {
    this.userService.getCountryNumbers()
      .subscribe((data) => {
        this.allCountryCodes = data;
      })
  }

  

  public getCountryNames()
  {
    this.userService.getCountryNames()
    .subscribe((data)=>
    {
      this.allCountryNames=data;
        for(let country in data)
        {
          let obj=
          {
            id:country,
            name:data[country]
          }
          this.countryNames.push(obj);
          this.countryNames = this.countryNames.sort((first, second) => {
            return first.name.toUpperCase() < second.name.toUpperCase() ? -1 :  1 ;
          });
        }
       
    });
   }

   public getCountryCodes()
   {
     this.userService.getCountryNumbers().subscribe(
       (data)=>
       {
         this.allCountryCodes=data;
       }
     )
   }

   public goToLoginPage()
   {
    this.router.navigate(['/login']);
   }

   public signupFunction()
   {
     if(!this.firstName)
     {
       this.toastr.warning('Firstname is missing');
     }
     else if(!this.lastName)
     {
       this.toastr.warning('lastname is missing')
     }
     else if(!this.userName)
     {
      this.toastr.warning('username is missing');
     }
     else if(!this.countryName)
     {
      this.toastr.warning('countryname is missing');
     }
     else if(!this.mobileNumber)
     {
      this.toastr.warning('mobilenumber is missing');
     }
     else if(!this.email)
     {
      this.toastr.warning('email is missing');
     }
     else if(!this.password)
     {
      this.toastr.warning('password is missing');
     }
     else
     {
        if(this.isAdmin == undefined)
       {
         this.isAdmin=false
       }
       let signupdata=
       {
         firstName:this.firstName,
         lastName:this.lastName,
         userName:this.userName,
         email:this.email,
         password:this.password,
         countryName:this.countryName,
         mobileNumber:this.mobileNumber,
         isAdmin:this.isAdmin
       }
        this.userService.signup(signupdata)
        .subscribe(
          (success)=>
          {
            if(success.status == 200)
            {
              this.toastr.success('User created Successfully. Verification has been send to your mail');
              setTimeout(() => {
                this.goToLoginPage();
              },2000);
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

            this.router.navigate(['/error']);
          }
          else if(error.status == 400)
          {
            this.toastr.warning("signup Failed", "Wrong password");
          }
          else
          {
            this.toastr.warning("signup Failed", "Some error occured");
            this.router.navigate(['/error']);
          }
          }

        )
        
     }
   }



}
