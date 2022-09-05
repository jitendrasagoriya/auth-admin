import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { HistoryService } from 'src/app/common/history.service';
import { ApplicationRequest } from 'src/app/entity/applicationRequest';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';
import { ApplicationService } from '../application.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {


  registerAppForm: FormGroup;
  name: string = '';
  discription!: string;
  submitted = false;
  isLoggedIn: boolean = false;
  token: string;

  constructor(private router: Router, private route: ActivatedRoute, 
      private service:ApplicationService, private notifier: NotifierService, 
        private formBuilder: FormBuilder,private messageService: MessageService,
        private spinner: NgxSpinnerService) {

    this.registerAppForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      discription: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    if (environment.consoleLog === 'debug')
      console.log('IsLoggedIn :->' + this.isLoggedIn);

    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/sign-in'], { relativeTo: this.route.parent });
    } else {
      this.token = localStorage.getItem('token');
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerAppForm.controls; }

  onSubmit() {
    if (this.registerAppForm.invalid) {
      this.notifier.notify('error', 'All field are required.');
      return;
    }
    this.submitted = true;

    const request: ApplicationRequest = {} as ApplicationRequest;

    request.appName = this.registerAppForm.controls['name'].value;
    request.description = this.registerAppForm.controls['discription'].value;

    this.spinner.show();

    this.service.newApplication(request,this.token)
      .subscribe(res=>{
        this.spinner.hide();
        if (res != undefined) {          
          this.notifier.notify('success', 'Application Registered!!');
          this.registerAppForm.reset();
          this.submitted = false;
        } else {
          this.notifier.notify('error', this.messageService.getMostResentMessage());
          this.submitted = false;
          return;
        }
      });


  }
}
