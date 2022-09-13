import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from "@angular/router";
import {filter, map} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../user.service";
import {NotifierService} from "angular-notifier";
import {ApplicationUser} from "../../entity/applicationUserResponse";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  id:string;
  token: string;
  user = {} as ApplicationUser;
  applicationEditForm: any;

  constructor(private router: Router,private route: ActivatedRoute,private spinner: NgxSpinnerService,
              private modalService: NgbModal,private  userService:UserService,private notifier: NotifierService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    const routeParams = this.route.snapshot.paramMap;
    this.id = routeParams.get('id');
    this.spinner.show().then(value => {});
    this.loadUserDetails();

  }


  public loadUserDetails():void {
    this.userService.getUserDetails(this.token,this.id)
      .subscribe( (response)=> {
        this.user = response;
        if (environment.consoleLog === 'debug')
          console.log(JSON.stringify(this.user));
        this.spinner.hide().then(value => {});
      },(e)=>{
        this.notifier.notify('error',e);
        this.spinner.hide().then(value => {});
      })
  }

  edit() {

  }

  back() {
    this.router.navigate(['/user/view']).then(r => {});
  }
}
