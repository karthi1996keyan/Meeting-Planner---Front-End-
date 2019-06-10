import {Component,ChangeDetectionStrategy,ViewChild,TemplateRef,OnInit, EventEmitter} from '@angular/core';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';
import  {SocketService} from './../../socket.service';
import {ActivatedRoute,Router}  from '@angular/router';

import {MeetingService} from './../../meeting.service';

import {UserService} from './../../user.service';
import { Cookie } from 'ng2-cookies';

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
    styleUrls: ['user.component.css'],
    templateUrl: 'user.component.html',
    providers:[SocketService]
  })
  export class UserComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    @ViewChild('modalScheduleMeeting') modalScheduleMeeting:TemplateRef<any>;
    
    @ViewChild('modalUpdateMeeting') modalUpdateMeeting:TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
  
    CalendarView = CalendarView;

    private authToken:any;
    private userId:any;
    private userName:any;
    public userInfo:any;
    
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



    ngOnInit()
    {
      this.authToken=Cookie.get('authToken');
      this.userInfo=this.userService.getLocalStorage();
      this.userId=Cookie.get('userId');
      this.userName=Cookie.get('userName');

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
        
          if(this.userInfo.isAdmin == 'false')
          {
            this.verifyUser();
            this.notificationFromAdmin();
            this.getAllMeetingDetails();
            this.authErrorFunction();
          }
          else
          {
              this.router.navigate(['/admin-dashboard']);
          }

      }
      else
      {
        
      this.toastr.error('Either Logged out or some important parameters missing');
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
  
    constructor(private modal: NgbModal,
      private meetingService:MeetingService,
      private userService:UserService,
      public avticatedRoute:ActivatedRoute,
      public toastr:ToastrService,
      public socketService:SocketService,
      public router:Router) {

        

    }
    
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
      this.meetingTitle=event.title;
      this.meetingStartDate=event.start;
      this.meetingEndDate=event.end;
      this.meetingDescription=event.meetingDescription;
      this.meetingPlace=event.meetingPlace;
      this.hostId=event.hostId;
      this.hostName=event.hostName;
      this.participantId=event.participantId;
      this.participantName=event.participantName;
      this.participantEmail=event.participantEmail;
      
      this.modal.open(this.modalUpdateMeeting, { size: 'lg' });
    }
  
    setView(view: CalendarView) {
      this.view = view;
    }
  
    closeOpenMonthViewDay() {
      this.activeDayIsOpen = false;
    }


    //functions

  

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
              data.title=data.meetingTitle,
              data.start=new Date(data.meetingStartDate),
              data.end=new Date(data.meetingEndDate),
              data.color=colors.green,
              data.actions=this.actions,
              data.remindMe=true
              

            }
            this.events=event;
            this.refresh.next();
          }
          else
          {
            if(success.status ==404)
            {
                
           this.toastr.error(success.message);
            } 
          }
        },
        (error)=>
        {
          
          if(error.status == 404)
          {

            this.toastr.warning("Error getting meetin details");
            
            this.router.navigate(['/pageNotFound']);
          }
         
          else
          {
            this.toastr.warning("Error getting meetin details");
            this.router.navigate(['/error']);
          }
        }
      )
    }//end get all meeting details 



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
            Cookie.delete('userId');
            Cookie.delete('userName');

            
            this.socketService.disconnectedSocket();
            this.socketService.exitSocket();
            
            this.toastr.success(success.message);
            setTimeout(() => {
              
            this.router.navigate(['/login']);
 
            }, 2000);
            
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

    // socket scripts


    public verifyUser:any=()=>
    {
         this.socketService.verifyUser().
      subscribe(
        ()=>
        {
          this.socketService.setUser(this.authToken)
        });
    }

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
  
    // listening own id

    public notificationFromAdmin()
    {
      this.socketService.notificationFromAdmin(this.userId)
      .subscribe(
        (success)=>
        {
            this.getAllMeetingDetails();
            this.toastr.info('Update from admin',success.message);
        }
      )
      
    }

  }

