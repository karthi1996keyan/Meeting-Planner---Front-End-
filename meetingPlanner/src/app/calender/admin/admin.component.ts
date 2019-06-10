import {Component,ChangeDetectionStrategy,ViewChild,TemplateRef,OnInit, EventEmitter} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';
 
import {ActivatedRoute,Router}  from '@angular/router';

import {MeetingService} from './../../meeting.service';

import {UserService} from './../../user.service';
import { Cookie } from 'ng2-cookies';
import {SocketService} from './../../socket.service';
import {ToastrService} from 'ngx-toastr';

const colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };
  
  @Component({
    selector: 'mwl-demo-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['admin.component.css'],
    templateUrl: 'admin.component.html',
    providers:[SocketService]
  })
  export class AdminComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @ViewChild('modalScheduleMeeting') modalScheduleMeeting:TemplateRef<any>;
    @ViewChild('modalDeleteConfirmation') modalDeleteConfirmation:TemplateRef<any>;
    @ViewChild('modalAlertToastr') modalAlertToastr:TemplateRef<any>;
    
    
    
    @ViewChild('modalUpdateMeeting') modalUpdateMeeting:TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
  
    CalendarView = CalendarView;

    private authToken:any;
    private userId:any;
    public userInfo:any;
    public partiipantInfo:any;
    public userName:any;
    public reminder:boolean=true;
    
    public meetingId:any;
    public hostId:any;
    public hostName:any;
    public participantId:any;
    public participantName:any;
    public participantEmail:any;
    public meetingTitle:any;
    public meetingDescription:any;
    public meetingStartDate:any;
    public meetingEndDate:any;
    public meetingPlace:any;  

    constructor(private modal: NgbModal,
      private meetingService:MeetingService,
      private userService:UserService,
      public avticatedRoute:ActivatedRoute,
      public toastr:ToastrService,
      public router:Router,
      public socketService:SocketService) {
    }


    ngOnInit()
    {
      this.userId=this.avticatedRoute.snapshot.paramMap.get('userId');
      this.authToken=Cookie.get('authToken');
      this.userInfo=this.userService.getLocalStorage();
      this.hostId=Cookie.get('userId');
      this.hostName=Cookie.get('userName');
      this.userName=Cookie.get('userName');
      this.participantId=this.userId;

      
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
        
        this.getUserDetails();
        this.getAllMeetingDetails();
        this.authErrorFunction();
        setInterval(()=>
        {
          this.sendReminderToast();
        },5000);
        setInterval(()=>
        {
          this.sendReminderToastToUser();
        },35000);
      }
      else
      {
        this.router.navigate(['/error']);
        
      }

      
    }
  
    viewDate: Date = new Date();
  
    modalData: {
      action: string;
      event: CalendarEvent;
    };
  
    actions: CalendarEventAction[] = [
      
    ];
  
    refresh: Subject<any> = new Subject();
  
    
    events: CalendarEvent[] = [
    ];
  
    activeDayIsOpen: boolean = true;
  
 
    
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
      
      if (isSameMonth(date, this.viewDate)) {
        
        this.viewDate = date;
        if (
          (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
          events.length === 0
        ) {
          
          this.activeDayIsOpen = false;
        } else {
          this.activeDayIsOpen = true;
        }
      }
    }
  
    eventTimesChanged({
      event,
      newStart,
      newEnd
    }: CalendarEventTimesChangedEvent): void {
      this.events = this.events.map(iEvent => {
        if (iEvent === event) {
          return {
            ...event,
            start: newStart,
            end: newEnd
          };
        }
        return iEvent;
      });
      this.handleEvent('Dropped or resized', event);
    }
  
    handleEvent(action: string, event: CalendarEvent): void {
    
      this.modalData = { event, action };
      this.participantEmail=event.participantEmail;
      this.participantId=event.participantId;
      this.participantName=event.participantName;
      this.meetingTitle=event.title;
      this.meetingStartDate=event.start;
      this.meetingEndDate=event.end;
      this.meetingDescription=event.meetingDescription;
      this.meetingPlace=event.meetingPlace;
      
      this.modal.open(this.modalUpdateMeeting, { size: 'lg' });
    }
    deleteEvent(eventToDelete: CalendarEvent) {
      this.events = this.events.filter(event => event !== eventToDelete);
    }
  
    setView(view: CalendarView) {
      this.view = view;
    }
  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }


    //functions

    public getUserDetails()
    {
      this.userService.getSingleUserDetails(this.userId,this.authToken)
      .subscribe(
        (success)=>
        {
            if(success.status === 200)
            {
              this.participantId=success.data.userId;
              this.participantEmail=success.data.email;
              this.participantName=success.data.userName;
            }
            if(success.status == 404)
            {
              this.toastr.error('Page not found');
            }
            if(success.status == 500)
            {
             this.toastr.error('Failed to feth details');
            }
        },
        (error)=>
        {
          this.toastr.error(error);
        }
      )
    }

    public ScheduleMeeting()
    {
      this.getUserDetails();
      this.meetingTitle='';
      this.meetingStartDate='';
      this.meetingEndDate='';
      this.meetingDescription='';
      this.meetingPlace='';
      this.modal.open(this.modalScheduleMeeting,{size:'lg'})
    }


    public getAllMeetingDetails()
    {
      this.meetingService.getAllMeetingDetails(this.userId,this.authToken)
      .subscribe(
        (success)=>
        {
          if(success.status == 200)
          {
            let event=success.data;
            for(let data of event)
            {

              data.title=data.meetingTitle;
              let startDate=new Date(data.meetingStartDate);
              startDate.setHours(startDate.getHours() - 5);
              startDate.setMinutes(startDate.getMinutes()-30);
              data.start=startDate;
              let endDate=new Date(data.meetingEndDate);
              endDate.setHours(endDate.getHours()-5);
              endDate.setMinutes(endDate.getMinutes()-30);
              data.end=endDate;
              data.remindMe=true;
              data.color=colors.green;
              data.actions=this.actions;
              data.remindMe=true
            }
            this.events=event;
            this.refresh.next();
          }
          else
          {
            if(success.status ==404)
            {
              this.events=[];
              this.refresh.next();
           this.toastr.error(success.message);
            } 
          }
        },
        (error)=>
        {
          this.toastr.error(error.message);
        }
      )
    }//end get all meeting details 


    //send notification

    public sendReminderToast()
    {
      let currentTime=new Date().getTime();
      let allMeetings=this.events;




      for(let meeting of allMeetings)
      {
        
      //need to delete

      console.log(isSameDay(new Date(),meeting.start));
      console.log(new Date(meeting.start).getTime() - currentTime <= 60000 );
      console.log(new Date(meeting.start).getTime() > currentTime);
        if(isSameDay(new Date(),meeting.start) && new Date(meeting.start).getTime() - currentTime <= 60000
        && new Date(meeting.start).getTime() > currentTime)
        {
          if(meeting.remindMe && this.reminder)
          {
            this.modalData={action:'clicked',event:meeting};
            this.modal.open(this.modalAlertToastr,{size:'sm'});
            this.reminder=false;
          }
        }
          else if(isSameDay(new Date(),meeting.start) &&   currentTime - new Date(meeting.start).getTime() < 7000
          && new Date(meeting.start).getTime() < currentTime)
          {
            this.toastr.success(`${meeting.meetingTitle} : meeting stared`);

          }
        
      }
    }

    public sendReminderToastToUser()
    {
      let currentTime=new Date().getTime();
      let allMeetings=this.events;

      for(let meeting of allMeetings)
      {

        if(isSameDay(new Date(),meeting.start) && new Date(meeting.start).getTime() - currentTime <= 60000
        && new Date(meeting.start).getTime() > currentTime)
        {
              let data=
              {
                userId:meeting.participantId,
                message:`${this.meetingTitle} :  scheduled meeting will start in mins`
              }
              this.notifyUpdatedFromAdminToUsers(data);
        }
          else if(isSameDay(new Date(),meeting.start) &&   currentTime - new Date(meeting.start).getTime() < 35000
          && new Date(meeting.start).getTime() < currentTime)
          {
            let data=
            {
              userId:meeting.participantId,
              message:`${this.meetingTitle} :  Meeting Started`
            }
            this.notifyUpdatedFromAdminToUsers(data);



          }
        
      }
    }


    //validate start end date

    public validateStartEndDate(startDate:any,endDate:any)
    {
      let start=new Date(startDate);
      let end=new Date(endDate);
      if(end < start)
      {
        return true;
      } 
      else
      {
        return false;
      }
    }

    //validate  meeting date

    public validateMeetingDate(startDate:any)
    {
      let start=new Date(startDate);
      let end=new Date();

      if(start < end)
      {
          return true;
      }
      else 
      {
        return false;
      }
    }

    //create meeting 


    public CreateMeeting()
    {

      if(!this.hostId)
      {
        this.toastr.warning('Host Id is missing !')
      }
      else if(!this.hostName)
      {
        this.toastr.warning('Host Name is missing !');
      }
      else if(!this.participantId)
      {
        this.toastr.warning('Participant Id is missing !');
      }
      else if(!this.participantName)
      {
        this.toastr.warning('Participant Name is missing !');
      }
      else if(!this.participantEmail)
      {
        this.toastr.warning('Participant Email is missing !');
      }
      else if(!this.meetingTitle)
      {
        this.toastr.warning('Meeting Title  is missing !');
      }
      else if(!this.meetingDescription)
      {
        this.toastr.warning('Meeting Description is missing !');
      }
      else if(!this.meetingStartDate)
      {
        this.toastr.warning('Start Date is missing !');
      }
      else if(!this.meetingEndDate)
      {
        this.toastr.warning('End Date is missing !');
      }
      else if(!this.meetingPlace)
      {
        this.toastr.warning('Meeting Place is missing !');
      }
      else if(this.validateStartEndDate(this.meetingStartDate,this.meetingEndDate))
      {
        this.toastr.warning('End Date/Time cannot be before Start Date/Time');
      }
      else if(this.validateMeetingDate(this.meetingStartDate))
      {
        this.toastr.warning("Meeting can't be schedule in back date/time");
      }
      else
      {
      let data=
      {
        hostId:this.hostId,
        hostName:this.hostName,
        participantId:this.participantId,
        participantName:this.participantName,
        participantEmail:this.participantEmail,
        meetingTitle:this.meetingTitle,
        meetingDescription:this.meetingDescription,
        meetingStartDate:this.meetingStartDate,
        meetingEndDate:this.meetingEndDate,
        meetingPlace:this.meetingPlace,
        authToken:this.authToken
      }

      this.meetingService.createMeeting(data)
      .subscribe(
        (success)=>
        {
            if(success.status === 200)
            {
              this.toastr.success('Meeting Scheduled Successfully');
              this.modal.dismissAll(this.modalScheduleMeeting);
              this.getAllMeetingDetails();
              let data=
              {
                userId:this.userId,
                message:`${this.meetingTitle} :  ${this.hostName} scheduled meeting for you at ${this.meetingPlace}`
              }
              this.notifyUpdatedFromAdminToUsers(data);
            }
            else if(success.status == 404)
            {
              
              this.toastr.error(success.message);
            }
        },
        (error)=>
        {
          if(error.status == 404)
          {
            
          this.toastr.error("one or more parameter is missing ");

          }
        }
      )

      }
    }
    // end create meeting

    // update meeting
    public UpdateMeeting()
    {

      
      if(!this.hostId)
      {
        this.toastr.warning('Host Id is missing !')
      }
      else if(!this.hostName)
      {
        this.toastr.warning('Host Name is missing !');
      }
      else if(!this.participantId)
      {
        this.toastr.warning('Participant Id is missing !');
      }
      else if(!this.participantName)
      {
        this.toastr.warning('Participant Name is missing !');
      }
      else if(!this.participantEmail)
      {
        this.toastr.warning('Participant Email is missing !');
      }
      else if(!this.meetingTitle)
      {
        this.toastr.warning('Meeting Title  is missing !');
      }
      else if(!this.meetingDescription)
      {
        this.toastr.warning('Meeting Description is missing !');
      }
      else if(!this.meetingStartDate)
      {
        this.toastr.warning('Start Date is missing !');
      }
      else if(!this.meetingEndDate)
      {
        this.toastr.warning('End Date is missing !');
      }
      else if(!this.meetingPlace)
      {
        this.toastr.warning('Meeting Place is missing !');
      }
      else if(this.validateStartEndDate(this.meetingStartDate,this.meetingEndDate))
      {
        this.toastr.warning('End Date/Time cannot be before Start Date/Time');
      }
      else if(this.validateMeetingDate(this.meetingStartDate))
      {
        this.toastr.warning("Meeting can't be schedule in back date/time");
      }
      else 
      {
        


      let data=
      {
        participantEmail:this.participantEmail,
        meetingTitle:this.meetingTitle,
        meetingDescription:this.meetingDescription,
        meetingStartDate:this.meetingStartDate,
        meetingEndDate:this.meetingEndDate,
        meetingPlace:this.meetingPlace,
        authToken:this.authToken,
        meetingId:this.modalData.event.meetingId
      }

      this.meetingService.updateMeeting(data)
      .subscribe(
        (success)=>
        {
            if(success.status === 200)
            {
              this.toastr.success('Meeting Updated Successfully');
              this.modal.dismissAll(this.modalScheduleMeeting);
              this.getAllMeetingDetails();
              let data=
              {
                userId:this.userId,
                message:`${this.meetingTitle} : ${this.hostName} updated meeting for you at ${this.meetingPlace} `
              }
              this.notifyUpdatedFromAdminToUsers(data);
            }
            else
            {
              this.toastr.error(success.message);
            }
        },
        (error)=>
        {
          this.toastr.error(error.message);

        }
      )

      }
    }//end update meeting

    public deleteMeetingConfirm=()=>
    {
      this.modal.open(this.modalDeleteConfirmation,{size:'sm'});
    }

    public deleteMeeting=(userData)=>
    {
      console.log(this.participantId);
      this.meetingService.deleteMeeting(userData.meetingId,this.authToken)
      .subscribe(
        (success)=>
        {
          if(success.status == 200)
          {
            this.toastr.success('Meeting deleted Successfully');
            this.modal.dismissAll(this.modalDeleteConfirmation);
            this.modal.dismissAll(this.modalScheduleMeeting);
            this.getAllMeetingDetails();
            let data=
              {
                userId:this.participantId,
                message:`${this.meetingTitle} : Meeting has been deleted  by ${this.hostName}`
              }
              this.notifyUpdatedFromAdminToUsers(data);
            
          }
          else
          {
            this.toastr.error(success.message);
          }

        },
        (error)=>
        {
          this.toastr.error(error.message);

        }
      )
    }


    public goToAdminDashFunction()
    {
      this.router.navigate(['/admin-dashboard']);
    }
    
    public logoutFunction()
    {
      this.userService.logotFunction(this.hostId,this.authToken)
      .subscribe(
        (success)=>
        {
          if(success.status === 200)
          {
            localStorage.clear();
            Cookie.delete('authToken','/');
            Cookie.delete('userId','/');
            Cookie.delete('userName','/');
            this.socketService.disconnectedSocket();
            this.socketService.disconnect();
            this.toastr.success(success.message);
            this.router.navigate(['/login']); 
          }
          else
          {
            
            this.toastr.error(success.message);
          }
        },
        (err)=>
        {
          if(err.status == 404)
          {
            this.toastr.error("Logout Failed ","Already Logged out or Invalid User")
          }
          else
          {
            this.toastr.error("Some Error Occured","Error!");
            // this.router.navigate() sever erroor page
          }
        }
      )

    }

//socket functions here

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


public notifyUpdatedFromAdminToUsers=(data)=>
{
  this.socketService.notifyUsers(data);
}

  }

