import { Component, OnInit } from '@angular/core';
import {MeetingService} from './../../meeting.service';
import { UserService } from '../../user.service';
import {SocketService} from '../../socket.service';
import { Cookie } from 'ng2-cookies';
import {ToastrService} from 'ngx-toastr';
import {ActivationEnd,Router} from '@angular/router';


@Component({
  selector: 'app-admin-user',
  templateUrl: './admin-user.component.html',
  styleUrls: ['./admin-user.component.css'],
  providers:[SocketService]
})
export class AdminUserComponent implements OnInit {

 public allUsers:any;
 public authToken:any;
 public userId;any;
 public userName:any;
 public userInfo:any;
 public allOnlineUsersList:any;
 
 constructor(public meetingService:MeetingService,
    public userService:UserService,
    public toastr:ToastrService,
    public socketService:SocketService,
    public router:Router) {
   
  }

  ngOnInit()
   {
    this.authToken=Cookie.get('authToken');
    this.userId=Cookie.get('userId');
    this.userName=Cookie.get('userName');
    this.userInfo=this.userService.getLocalStorage();
    
    if(Cookie.get('authToken') != null &&
      Cookie.get('userId') != null &&
      Cookie.get('userName') != null &&
      Cookie.get('authToken') != undefined &&
      Cookie.get('userId') != undefined &&
      Cookie.get('userName') != undefined &&
      this.userService.getLocalStorage()  != null  &&
      this.userService.getLocalStorage() != undefined
        )
    {
      
    if(this.userInfo.isAdmin == 'true')
    {
      this.verifyUser();
      this.getOnlineUser();
      this.getAllUserDetails();
      this.authErrorFunction();
    }
    else
    {
      this.router.navigate(['/user-dashboard/meeting']);
      
    }

    }
    else 
    {
      this.toastr.error('Either Logged out or some important parameters missing');
      this.router.navigate(['/error']);
    }
  }
  //get all user details starts here
  public getAllUserDetails()
  {

    if(this.authToken !=null)
      {
        this.userService.getAllUsers(this.authToken)
        .subscribe(
        (success)=>
        {
          if(success.status === 200)
          {
            this.allUsers=success.data;
          }
          else
          {
            this.toastr.error(success.message);
          }
        },  //end success func
        (error)=>
        {
          this.toastr.error('Some error occured');
        } //end error
    )}   //end if 
    else
    {
      this.toastr.error('Authorization missing please login again');
      this.router.navigate(['/login']);
    }
  } //end get all user function

  //go to calender view function

  public goToCalenderView(userId)
  {
 
    this.router.navigate(['/admin-dashboard/user-meeting/',userId]) 
  } // end calender view function


  //socket functions

  //verify user event funtion
  public verifyUser:any=()=>
  {
        this.socketService.verifyUser().
    subscribe(
      (success)=>
      {
        this.socketService.setUser(this.authToken);
      },
      (error)=>
      {
        this.router.navigate(['/error'])
      }
    )
  }//end veify user function

  // auth error 
   public authErrorFunction()
   {
     this.socketService.listenAuthError().
     subscribe(
       (data)=>
       {
        this.toastr.info("Missing Authorization Key", "Please login again");
        this.router.navigate(['/login']);
       }
        
     );
   }

  //get online user list from socket
  public getOnlineUser:any=()=>
  {
    this.socketService.onlineUserList().
    subscribe(
     (data)=>
     {
       this.allOnlineUsersList=[];
       for(let x in data)
       {
         this.allOnlineUsersList.push(x);
       }
       for(let user of this.allUsers)
       {
         if(this.allOnlineUsersList.includes(user.userId))
         {
           user.status = 'online'
         }
         else 
         {
           user.status = 'offline'
         }
       }
       
     }
    )
  } // end  get online user list

  //go to meeting funtion  starts
  public goToMyMeetingFunction()
  {
    this.router.navigate(['/admin-dashboard/user-meeting/',this.userId]);
  } // go to meeting function 
  

  //logout funtion 
  public logoutFunction()
  {
    this.userService.logotFunction(this.userId,this.authToken)
    .subscribe(
      (success)=>
      {
        if(success.status === 200)
        {
          localStorage.clear();
          Cookie.delete('authToken');
          Cookie.delete('userId','/');
          Cookie.delete('userName','/');
          this.socketService.disconnectedSocket();
          this.socketService.disconnect();
          this.toastr.success(success.message);
          setTimeout(() => {
            this.router.navigate(['/login']); 
          },2000);
        }
        else if(success.status == 404)
        {
          this.toastr.error('Already logout or invalid authorization token ! login again');
          this.router.navigate(['/login']);
        }
        else
        {
          this.toastr.error(success.message);
          this.router.navigate(['/error']);
        } 
      },
      (err)=>
      {
        if(err.status == 404)
        {
          this.toastr.error("Logout Failed ","Already Logged out or Invalid User");
          this.router.navigate(['/login']);
        }
        else
        {
          this.toastr.error("Some Error Occured","Error!");
          this.router.navigate(['/error']);
        }
      }
    )

  } // end logout function
}
