import { Injectable } from '@angular/core';

import {HttpClient,HttpParams} from  '@angular/common/http';
import {HttpErrorResponse,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {

  public baseUrl='http://api.meetinplanner.xyz/api/v1.0.0/meeting';
  constructor(private http:HttpClient) { }

  //functions  start here 

  public createMeeting(meetingData):Observable<any>
  {
    const params=new HttpParams()
    .set('meetingTitle',meetingData.meetingTitle)
    .set('hostId',meetingData.hostId)
    .set('hostName',meetingData.hostName)
    .set('participantId',meetingData.participantId)
    .set('participantName',meetingData.participantName)
    .set('participantEmail',meetingData.participantEmail)
    .set('meetingDescription',meetingData.meetingDescription)
    .set('meetingStartDate',meetingData.meetingStartDate)
    .set('meetingEndDate',meetingData.meetingEndDate)
    .set('meetingPlace',meetingData.meetingPlace)
    .set('authToken',meetingData.authToken)

    return this.http.post(`${this.baseUrl}/create`,params);
  }//end create meeting


  // get meeting details

  public getMeetingDetails(meetingId,authToken):Observable<any>
  {
    return this.http.get(`${this.baseUrl}/details/${meetingId}?authtoken=${authToken}`);
  }

  //get all meeting details
  public getAllMeetingDetails(userId,authToken):Observable<any>
  {
    return this.http.get(`${this.baseUrl}/view/all/${userId}?authToken=${authToken}`);
  }

  //update meeting

  
  public updateMeeting(meetingData):Observable<any>
  {
    const params=new HttpParams()
    .set('meetingTitle',meetingData.meetingTitle)
    .set('meetingDescription',meetingData.meetingDescription)
    .set('meetingStartDate',meetingData.meetingStartDate)
    .set('meetingEndDate',meetingData.meetingEndDate)
    .set('meetingPlace',meetingData.meetingPlace)
    .set('authToken',meetingData.authToken)
    .set('participantEmail',meetingData.participantEmail)

    return this.http.put(`${this.baseUrl}/update/${meetingData.meetingId}`,params);
  }//end update meeting


  public deleteMeeting(meetingId,authToken):Observable<any>
  {
    const params=new HttpParams()
    .set('authToken',authToken)
    return this.http.post(`${this.baseUrl}/delete/${meetingId}`,params);
  }

  public sentNotifications(userId,authToken):Observable<any>
  {
    const params=new HttpParams()
    .set('authToken',authToken)
    .set('userId',userId)

    return this.http.post(`${this.baseUrl}/sendNotifications`,params);
  }

}
