import { Injectable } from '@angular/core';

import {HttpClient,HttpParams} from '@angular/common/http';
import {HttpErrorResponse,HttpHeaders} from '@angular/common/http';

import { Observable}  from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public baseUrl='http://api.meetinplanner.xyz/api/v1.0.0/users';
  constructor(public http:HttpClient) { }

  public setLocalStorage=(data)=>
  {
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  
  public getLocalStorage=()=>
  {
    return JSON.parse(localStorage.getItem('userInfo'));
  }
  //signup function api call

  public signup(signupdata):Observable<any>
  {
     const params=new HttpParams()
     .set('firstName',signupdata.firstName)
     .set('lastName',signupdata.lastName)
     .set('mobileNumber',signupdata.mobileNumber)
     .set('email',signupdata.email)
     .set('password',signupdata.password)
     .set('countryName',signupdata.countryName)
     .set('userName',signupdata.userName)
     .set('isAdmin',signupdata.isAdmin)

     return this.http.post(`${this.baseUrl}/signup`,params);
  }

  //login function api call
  public login(logindata):Observable<any>
  {
    const params=new HttpParams()
    .set('email',logindata.email)
    .set('password',logindata.password)

    return this.http.post(`${this.baseUrl}/login`,params);
    
  }

  //reset password api call


  public forgotPassword(resetdata):Observable<any>
  {
    const params=new HttpParams()
    .set('email',resetdata)

    return this.http.post(`${this.baseUrl}/forgot-password`,params);
  }
  
  //update password api call

  public updatePassword(updatedata):Observable<any>
  {

    const params=new HttpParams()
    .set('validationToken',updatedata.validationToken)
    .set('password',updatedata.password)

    return this.http.put(`${this.baseUrl}/update-password`,params);
  }

  public verifyEmail(userId):Observable<any>
  {
    console.log('called');
    const params=new HttpParams()
    .set('userId',userId)

    return this.http.put(`${this.baseUrl}/verifyEmail`,params);
  }

  public getAllUsers(authToken):Observable<any>
  {
    return this.http.get(`${this.baseUrl}/view/all?authToken=${authToken}`);
  }
 
  public getSingleUserDetails(userId,authToken):Observable<any>
  {
    return this.http.get(`${this.baseUrl}/view/details/${userId}?authToken=${authToken}`);
  }


  //logout function

  public logotFunction(userId,authToken):Observable<any>
  {
    const params=new HttpParams()
    .set('userId',userId);
    return this.http.post(`${this.baseUrl}/logout?authToken=${authToken}`,params);
  }

 //get country names

 public getCountryNames():Observable<any>
 {
   return this.http.get('./../assets/countryNames.json');
 }

 //get country code  numbers
 public getCountryNumbers(): Observable<any> {

  return this.http.get("./../assets/countryPhoneCodes.json");
  
}


  




}
