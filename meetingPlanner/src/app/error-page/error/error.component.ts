import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(public route:Router) { }

  ngOnInit() {
  
  }

  public goToLogin()
  {
    this.route.navigate(['/login'])
  }
}
