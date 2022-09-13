import { Component, OnInit } from '@angular/core';
import {ApplicationUser} from "../../entity/applicationUserResponse";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {environment} from "../../../environments/environment";
import {UserService} from "../user.service";
import {NgxSpinnerService} from "ngx-spinner";
import {NotifierService} from "angular-notifier";
import {ActivatedRoute, Router} from "@angular/router";
import {Application, Authentication} from "../../entity/dashboardResponce";
import {DatePipe} from "@angular/common";
import {LoginDto} from "../../entity/logindto";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbdModalConfirm} from "../../application/details/details.component";


@Component({
  selector: 'ng-modal-user-edit-confirm',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Confirmation!!</h4>
    <button type="button" class="btn-close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')"></button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to update User?</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class NgModalUserEditConfirm {
  constructor(public modal: NgbActiveModal) { }
}

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  userEditForm: FormGroup;
  user = {} as ApplicationUser ;
  token: string;
  private id: string;
  submitted: boolean = false;

  constructor( private router: Router,private route: ActivatedRoute,private formBuilder: FormBuilder,private modalService: NgbModal,private  userService:UserService,private spinner: NgxSpinnerService
        ,private notifier: NotifierService,public datepipe: DatePipe) {

    this.token = localStorage.getItem('token');
    const routeParams = this.route.snapshot.paramMap;
    this.id = routeParams.get('id');

    this.userEditForm = this.formBuilder.group({
      id:new FormControl({value:'',disable:true},Validators.required),
      name:new FormControl('',Validators.required),
      appName:new FormControl({value:'',disable:true},Validators.required),
      appId:new FormControl({value:'',disable:true},Validators.required),
      date:new FormControl({value:'',disable:true},Validators.required),
      type:new FormControl('',Validators.required),
      active:new FormControl('',Validators.required),
      loggedOut:new FormControl({value:'',disable:true},Validators.required),
    });
  }

  private updateForm(app: ApplicationUser) {
    this.userEditForm.get('id').setValue(app.id);
    this.userEditForm.get('name').setValue(app.name);
    this.userEditForm.get('appName').setValue(app.applicationName);
    this.userEditForm.get('appId').setValue(app.appId);
    this.userEditForm.get('date').setValue(this.datepipe.transform(new Date(app.date), 'yyyy-MM-dd'));
    this.userEditForm.get('type').setValue(app.type);
    this.userEditForm.get('active').setValue(app.active);
    this.userEditForm.get('loggedOut').setValue(app.logout);
  }

  onUpdate() {
    this.modalService.open(NgModalUserEditConfirm).result.then((result) => {
      this.updateUser();
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
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

  private updateUser():void {

    if (this.userEditForm.invalid) {
      return;
    }
    this.submitted = true;

    const auth: Authentication = {} as Authentication;
    auth.userName = this.f['name'].value;
    auth.userType = this.f['type'].value;
    auth.userId = this.f['id'].value;
    auth.isActive = this.f['active'].value;
    auth.isLogout = this.f['loggedOut'].value;
    auth.appId = this.f['appId'].value;
    this.spinner.show().then(value => {});
    this.userService.updateAuthentication(this.token,auth)
      .subscribe((response)=>{
        if (response.errorCode != undefined && response.errorCode != 200) {
          this.notifier.notify('error', response.errorMessage?response.errorMessage:'Something went wrong.Please try some time later.');
        } else {
          this.user = response;
          this.notifier.notify('success', 'User has been successfully updated!!!');

        }
        this.submitted = false;
        this.spinner.hide().then(value => {});
      },(e)=>{
        this.notifier.notify('error',e);
        this.spinner.hide().then(value => {});
        this.submitted = false;
      })
  }

  ngOnInit(): void {
    this.spinner.show();
    this.loadUserDetails()
  }


  public loadUserDetails():void {
    this.userService.getUserDetails(this.token,this.id)
      .subscribe( (response)=> {
        this.user = response;
        if (environment.consoleLog === 'debug')
          console.log(JSON.stringify(this.user));
        this.updateForm(this.user);
        this.spinner.hide().then(value => {});
      },(e)=>{
        this.notifier.notify('error',e);
        this.spinner.hide().then(value => {});
      })
  }

  get f() { return this.userEditForm.controls; }

  cancel() :void{
    this.router.navigate(['/user/view']);
  }


}
