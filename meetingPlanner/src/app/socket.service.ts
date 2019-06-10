import { Injectable } from '@angular/core';

import {HttpHeaders,HttpParams} from '@angular/common/http';
import {HttpClient,HttpErrorResponse} from'@angular/common/http';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public baseUrl="http://api.meetinplanner.xyz"; 
  public socket;
  constructor(public http:HttpClient) {

    this.socket=io(this.baseUrl);
   }

   //start listening verify user socket
   public verifyUser=()=>
   {
     return Observable.create((observer)=>
     {
       this.socket.on('verify-user',(data)=>
       {
         observer.next(data);
       })
     });
   }//end verify user

   // online user list 
   public onlineUserList=()=>
   {
      return Observable.create((observer)=>
      {
        this.socket.on('onlineuserlist',(allOnlineUsers)=>
        {
          observer.next(allOnlineUsers);
        });
      });
   }//end online user list 

   public disconnect=()=>
   {
     return Observable.create((observer)=>
     {
       this.socket.on('disconnect',(data)=>
       {
          observer.next(data);
       });
     });
   }//end disconnect

   public listenAuthError=()=>
   {
    return Observable.create((observer)=>
    {
      this.socket.on('auth-error',(data)=>
      {
         observer.next(data);
      });
    });
   }

   public notificationFromAdmin=(userId)=>
   {
    return Observable.create((observer)=>
    {
      this.socket.on(userId,(data)=>
      {
         observer.next(data);
      });
    })
   }//end notification from admin

   //end event that has been listened

   //emitted events

   public setUser=(authToken)=>
   {
     this.socket.emit('setuser',authToken);
   }

   public notifyUsers=(userData)=>
   {
    this.socket.emit('notify-updates',userData);
   }

   public exitSocket=()=>
   {
     this.socket.disconnect();
   }

  public disconnectedSocket=()=>
  {
    this.socket.emit("disconnect",'');
  } 

}
