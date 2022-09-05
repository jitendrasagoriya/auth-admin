import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { NotifierService } from 'angular-notifier';
import { LoginDto } from 'src/app/entity/logindto';
import { RegistorRequest } from 'src/app/entity/registerRequest';
import { Response } from 'src/app/entity/responce';
import { MessageService } from 'src/app/http/message.service';
import { PasswordConfirmValidatorDirective } from 'src/app/validators/password-confirm-validator.directive';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  userName: string = '';
  password!: string;
  confirmPassword!: string;
  submitted = false;
  aggrement:boolean;

  registerForm: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService
    , private notifier: NotifierService, private formBuilder: FormBuilder,
    private messageService: MessageService) {

    this.registerForm = this.formBuilder.group({
      userName: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRememberChanged(event:any){ 
     this.aggrement = event.target.checked
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onSignUp() {

    if (this.registerForm.invalid) {
      this.notifier.notify('error', "Please camplete sign up form.");
      return;
    }

    if(!this.aggrement) {
      this.notifier.notify('error', "Please accept Aggrement.");
      return;
    }

    this.submitted = true;


    const register: RegistorRequest = {} as RegistorRequest;
    register.userName = this.registerForm.controls['userName'].value;
    register.passward = this.registerForm.controls['password'].value;
    if (environment.consoleLog === 'debug')
      console.log(JSON.stringify(register));

    this.authService.register(register)
      .subscribe(r => {
        if (environment.consoleLog === 'debug')
          console.log(JSON.stringify(r));
        if (r.errorCode != undefined && r.errorCode != 200) {
          this.notifier.notify('error', r.errorMessage);
        } else {           
          if (r.userId != undefined && r.userId !== '') {
            localStorage.setItem('userName', r.userName)
            this.router.navigate(['sign-success'], { relativeTo: this.route.parent });
          } else {
            this.notifier.notify('error', "SomeThing Went Wrong.Please try again.");
          }
        }
        this.submitted = false;
      });
  }

  // On Signup link click
  onSignIn() {
    this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
  }

  ngOnInit(): void {
    $.getScript('./assets/js/form-validations.js');
    $.getScript('./assets/js/bs-custom-file-input.min.js');
  }

}
