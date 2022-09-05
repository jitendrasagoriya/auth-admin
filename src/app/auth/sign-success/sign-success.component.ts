import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sign-success',
  templateUrl: './sign-success.component.html',
  styleUrls: ['./sign-success.component.scss']
})
export class SignSuccessComponent implements OnInit {

  email:string;
  isLoggedIn:boolean = false;

  constructor(private router: Router,private route: ActivatedRoute) { }


  ngOnInit(): void {
    this.email = localStorage.getItem('userName');
    this.isLoggedIn =  Boolean(localStorage.getItem('isLoggedIn'));
    if(this.email==undefined && this.email.length ==0) {
      this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
    }
    if(this.isLoggedIn) {      
      this.router.navigate(['dashboard/e-commerce'], { relativeTo: this.route.parent });
    }
  }

  onSignup(){
    this.router.navigate(['sign-up'], { relativeTo: this.route.parent });
  }
  onSignin(){
    this.router.navigate(['sign-in'], { relativeTo: this.route.parent });
  }

}
