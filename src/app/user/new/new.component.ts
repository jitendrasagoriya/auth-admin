import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApplicationService } from 'src/app/application/application.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';

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
  isLoggedIn: boolean = false;
  token: string;


  constructor(private router: Router, private route: ActivatedRoute, private notifier: NotifierService,
    private authService:AuthService,private applicationService:ApplicationService,private formBuilder: FormBuilder, private messageService: MessageService,
    private spinner: NgxSpinnerService) {

    this.registerUserForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required]]
    });
  }

  get f() { return this.registerUserForm.controls; }

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

  
  onSubmit() {
    if (this.registerUserForm.invalid) {
      this.notifier.notify('error', 'All field are required.');
      return;
    }
  }

}
