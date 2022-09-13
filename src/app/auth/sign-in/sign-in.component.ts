import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from 'angular-notifier';
import { HistoryService } from 'src/app/common/history.service';
import { LoginDto } from 'src/app/entity/logindto';
import { MessageService } from 'src/app/http/message.service';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {


  loginForm: FormGroup;
  userName: string = '';
  password!: string;
  submitted = false;

  constructor(private router: Router, private route: ActivatedRoute,
     private authService: AuthService
    , private notifier: NotifierService, private formBuilder: FormBuilder,
    private messageService: MessageService) {
    this.loginForm = this.formBuilder.group({
      userName: ['jitendra.sagoriya.jio@gmail.com', [Validators.required,Validators.email]],
      password: ['J1tendr@', [Validators.required, Validators.minLength(6)]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {return this.loginForm.controls;}

  onSignIn() {


    if (this.loginForm.invalid) {
      return;
    }
    this.submitted = true;
    const login: LoginDto = {} as LoginDto;
    login.userName = this.loginForm.controls['userName'].value;
    login.password = this.loginForm.controls['password'].value;

    this.authService.login(login)
      .subscribe(loginResponse => {
        console.log('Token :-> ' + loginResponse);
        if (loginResponse != undefined) {
          localStorage.setItem('isLoggedIn', "true");
          localStorage.setItem('token', loginResponse.token)
          localStorage.setItem('userName', loginResponse.userName)
          localStorage.setItem('userType', loginResponse.userType)
          localStorage.setItem('userId',loginResponse.userId)
          this.router.navigate(['dashboard/']).then(r => {});
          this.submitted = false;
        } else {
          this.notifier.notify('error', this.messageService.getMostResentMessage());
          this.submitted = false;
          return;
        }
      });

  }

  // On Forgot password link click
  onForgotpassword() {
    this.router.navigate(['forgot-password'], { relativeTo: this.route.parent });
  }

  // On Signup link click
  onSignup() {
    this.router.navigate(['sign-up'], { relativeTo: this.route.parent });
  }


  ngOnInit(): void {
  }

}
