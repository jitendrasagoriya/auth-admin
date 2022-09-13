import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {NotifierService} from "angular-notifier";
import {UserService} from "../user/user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {Userdetails} from "../entity/userdetails";
import {DatePipe} from "@angular/common";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgModalUserEditConfirm} from "../user/edit/edit.component";
import {environment} from "../../environments/environment";


@Component({
  selector: 'ng-modal-user-details-edit-confirm',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Confirmation!!</h4>
    <button type="button" class="btn-close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')"></button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to update User Details?</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class NgModalUserDetailsEditConfirm {
  constructor(public modal: NgbActiveModal) { }
}


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  userDetailsForm: FormGroup;
  submitted = false;
  token: string;
  userName:string;
  userType:string;
  userDetails = {} as Userdetails;
  private id: string;


  constructor(private router: Router, private route: ActivatedRoute,private modalService: NgbModal, private notifier: NotifierService,
              private userService: UserService,private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService,public datePipe: DatePipe) {

  }

  get f() { return this.userDetailsForm.controls; }

  private createDetailsByFormControls(): Userdetails {
    const userDetails = {} as Userdetails;
    userDetails.fullName = this.f['name'].value;
    userDetails.mobile = this.f['mobile'].value;
    userDetails.gender = this.f['gender'].value;
    userDetails.dob = this.f['dob'].value;
    userDetails.address = this.f['address'].value;
    userDetails.avatar = this.f['avatar'].value;
    return  userDetails;
  }

  private updateForm(userdetails: Userdetails): void {
    this.userDetailsForm.get('name').setValue(userdetails.fullName);
    this.userDetailsForm.get('username').setValue(this.userName);
    this.userDetailsForm.get('mobile').setValue(userdetails.mobile);
    this.userDetailsForm.get('dob').setValue(this.datePipe.transform(new Date(userdetails.dob), 'yyyy-MM-dd'));
    this.userDetailsForm.get('gender').setValue(userdetails.gender);
    this.userDetailsForm.get('address').setValue(userdetails.address);
    this.userDetailsForm.get('avatar').setValue(userdetails.avatar);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.userName = localStorage.getItem('userName');
    this.userType = localStorage.getItem('userType');
    this.id = localStorage.getItem('userId')

    this.userDetailsForm = this.formBuilder.group({
      username:new FormControl({value: this.userName, disabled: true}, Validators.required),
      name:new FormControl(''),
      mobile:new FormControl(''),
      type:new FormControl(this.userType),
      gender:new FormControl(''),
      dob:new FormControl(''),
      address:new FormControl(''),
      avatar:new FormControl(''),
    });
    this.getUserDetails();
  }


  onUpdate() {
    this.modalService.open(NgModalUserEditConfirm).result.then((result) => {
      this.update();
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
    if (this.userDetailsForm.invalid) {
      return;
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private getUserDetails():void {
    this.spinner.show().then(value => {});
    this.userService.getUserDetailsByToken(this.token)
      .subscribe((response) => {
        if (response.errorCode != undefined && response.errorCode != 200) {
          this.notifier.notify('error', response.errorMessage?response.errorMessage:'Something went wrong.Please try some time later.');
        } else {
          this.userDetails = response;
          if (environment.consoleLog === 'debug')
            console.log(JSON.stringify(this.userDetails));

          this.updateForm(this.userDetails);
          this.spinner.hide().then(value => {});
        }
      },(e) => {
        this.notifier.notify('error',e);
        this.spinner.hide().then(value => {});
      })
    this.spinner.hide().then(value => {});
  }

  private update():void {
    this.submitted = true;
    const userdetails = this.createDetailsByFormControls();
    this.userService.updateUserDetails(this.token,userdetails)
      .subscribe((response) => {
        if (response.errorCode != undefined && response.errorCode != 200) {
          this.notifier.notify('error', response.errorMessage?response.errorMessage:'Something went wrong.Please try some time later.');
          this.spinner.hide().then(value => {});
          this.submitted = false;
        } else {
          this.userDetails = response;
          this.notifier.notify('success','User Details has been successfully updated/Added!!!');
          this.spinner.hide().then(value => {});
          this.submitted = false;
        }
      }, (e) => {
        this.notifier.notify('error',e);
        this.spinner.hide().then(value => {});
        this.submitted = false;
      });
  }
}
