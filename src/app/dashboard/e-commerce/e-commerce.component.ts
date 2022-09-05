import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { DashboardResponse } from 'src/app/entity/dashboardResponce';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-e-commerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss']
})
export class ECommerceComponent implements OnInit {

  isLoggedIn: boolean = false;
  token: string;
  dashBoard: DashboardResponse = {} as DashboardResponse;


  constructor(private router: Router, private dashboardService: DashboardService,
    private route: ActivatedRoute, private notifier: NotifierService,
    private messageService: MessageService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {    
    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    if (environment.consoleLog === 'debug')
      console.log('IsLoggedIn :->' + this.isLoggedIn);

    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/sign-in'], { relativeTo: this.route.parent });
    } else {
      this.spinner.show();
      this.token = localStorage.getItem('token');
      if (environment.consoleLog === 'debug')
        console.log('Token :-> ' + this.token);
      this.getDasdBoard();
      this.spinner.hide();
    }
  }

  public activate(id:string):void {
    if (environment.consoleLog === 'debug')
      console.log('user id -> '+ id);

  }

  public remove(id:String):void {
    if (environment.consoleLog === 'debug')
      console.log('user id -> '+ id);

  }


  public getDasdBoard(): any {
    this.dashboardService.dashboard(this.token).subscribe(response => {
      if (response != undefined) {
        this.dashBoard = response;
        if (environment.consoleLog === 'debug')
          console.log('Response :-> ' + JSON.stringify(response));

      } else {
        this.notifier.notify('error', this.messageService.getMostResentMessage());
        return;
      }
    });
  }

}
