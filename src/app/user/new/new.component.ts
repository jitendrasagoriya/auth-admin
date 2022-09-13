import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from 'src/app/application/application.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Application } from 'src/app/entity/dashboardResponce';
import { RegistorRequest } from 'src/app/entity/registerRequest';
import { SearchData } from 'src/app/entity/searchdata';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  registerUserForm: FormGroup;
  name: string = '';
  discription!: string;
  submitted = false;
  token: string;
  keyword = 'name';
  selectedId: string;
  data: SearchData[] = [];


  constructor(private router: Router, private route: ActivatedRoute, private notifier: NotifierService,
    private userService: UserService, private applicationService: ApplicationService, private formBuilder: FormBuilder,
    private messageService: MessageService, private spinner: NgxSpinnerService) {

    this.registerUserForm = this.formBuilder.group({
      email: ['jitendrasagoriya@yahoo.co.in', [Validators.required, Validators.email]],
      password: ['J1tendr@', [Validators.required, Validators.minLength(6)]],
      confirm: ['J1tendr@', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() { return this.registerUserForm.controls; }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    ;
    this.applicationService.applicationList(this.token)
      .subscribe(res => {
        if (environment.consoleLog === 'debug')
          console.log('IsLoggedIn :->' + JSON.stringify(res));
        res.forEach(element => {
          let d = {} as SearchData
          d.id = element.id;
          d.name = element.appName;
          this.data.push(d);
        });

        if (environment.consoleLog === 'debug')
          console.log('data :->' + JSON.stringify(this.data));

      });
  }




  onSubmit() {
    if (this.registerUserForm.invalid) {
      this.notifier.notify('error', 'All field are required.');
      return;
    }
    this.spinner.show();
    this.submitted = true;
    const register: RegistorRequest = {} as RegistorRequest;
    register.userName = this.f['email'].value;
    register.passward = this.f['password'].value;
    if (environment.consoleLog === 'debug')
      console.log(JSON.stringify(register));

    this.applicationService.applicationById(this.selectedId, this.token)
      .subscribe(res => {
        if (res != undefined) {
          this.userService.register(res, register)
            .subscribe(res => {
              if (res.errorCode != undefined && res.errorCode != 200) {
                this.notifier.notify('error', res.errorMessage);
              } else {
                if (res.userId != undefined && res.userId !== '') {
                  this.registerUserForm.reset();
                  this.notifier.notify('success', "User Successfully registered!!");
                } else {
                  this.notifier.notify('error', "SomeThing Went Wrong.Please try again.");
                }
              }
              this.submitted = false;
              this.spinner.hide();
            });
        } else {
          this.notifier.notify('error', "SomeThing Went Wrong.Please try again.");
        }
      })

  }

  selectEvent(item) {
    this.selectedId = item.id;
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }
}
