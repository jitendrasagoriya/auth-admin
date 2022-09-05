import { DatePipe } from '@angular/common';
import { Component, OnInit, Type } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { Application } from 'src/app/entity/dashboardResponce';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';
import { ApplicationService } from '../application.service';


@Component({
  selector: 'ngbd-modal-confirm',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Confirmation!!</h4>
    <button type="button" class="btn-close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')"></button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to update application?</strong></p>  
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class NgbdModalConfirm {
  constructor(public modal: NgbActiveModal) { }
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  id: string;
  idEditable: boolean = false;
  submitted = false;
  applicationEditForm: FormGroup;
  application: Application = {} as Application;
  isLoggedIn: boolean = false;
  token: string;
  isEditPage: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private modalService: NgbModal,
    private applicationService: ApplicationService, private notifier: NotifierService,
    private messageService: MessageService, private spinner: NgxSpinnerService, private formBuilder: FormBuilder, public datepipe: DatePipe) { }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.id = routeParams.get('id');
    const data: Data = this.route.snapshot.data;
    this.idEditable = Boolean(data['edit']);
    this.isEditPage = Boolean(data['edit']);




    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    if (environment.consoleLog === 'debug')
      console.log('IsLoggedIn :->' + this.isLoggedIn);

    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/sign-in'], { relativeTo: this.route.parent });
    } else {
      this.token = localStorage.getItem('token');

      this.spinner.show();
      this.getApplicationById(this.id);
      this.spinner.hide();

      this.applicationEditForm = this.formBuilder.group({
        id: new FormControl({ value: this.application.id, disabled: true }, Validators.required),
        access: new FormControl({ value: this.application.access, disabled: true }, Validators.required),
        name: new FormControl({ value: this.application.appName, disabled: true }, Validators.required),
        description: new FormControl({ value: this.application.description, disabled: true }, Validators.required),
        salt: new FormControl({ value: this.application.salt, disabled: true }, Validators.required),
        onBoardTime: new FormControl({ value: this.application.onBoardTime, disabled: true }, Validators.required),
        active: new FormControl({ value: this.application.isActive, disabled: true }, Validators.required),
      });

      if (this.idEditable) {
        this.enableApplicationForm();
      }
    }

  }

  onSignIn(): void { }


  editable(): void {
    this.idEditable = true;
    this.enableApplicationForm();
  }


  private enableApplicationForm() {
    this.applicationEditForm.get('name').enable();
    this.applicationEditForm.get('description').enable();
    this.applicationEditForm.get('salt').enable();
    this.applicationEditForm.get('active').enable();
  }

  cancelUpdate(): void {

    if (this.isEditPage) {
      this.router.navigate(['/application/list'], { relativeTo: this.route.parent });
    } else {
      this.idEditable = false;
      Object.keys(this.applicationEditForm.controls).forEach(key => {
        this.applicationEditForm.get(key).disable();
      });
    }
  }

  update(): void {
    this.openUpdate();
  }
  openUpdate() {
    this.modalService.open(NgbdModalConfirm).result.then((result) => { 
      this.updateApplication();
    }, (reason) => {
      alert(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }


  private updateApplication() {
    const request = {} as Application;
    request.appName = this.applicationEditForm.controls['name'].value
    request.id = this.applicationEditForm.controls['id'].value;
    request.description = this.applicationEditForm.controls['description'].value;
    request.isActive = this.applicationEditForm.controls['active'].value;
    request.salt = this.applicationEditForm.controls['salt'].value;

    if (environment.consoleLog === 'debug')
      console.log('Requested Application :->' + JSON.stringify(request));

    this.applicationService.update(request, this.token)
      .subscribe(res => {
        if (res != undefined) {
          if (environment.consoleLog === 'debug')
            console.log('Updated Application :->' + JSON.stringify(this.application));
            this.application = res;
          this.updateForm(this.application);
        } else {
          this.notifier.notify('error', this.messageService.getMostResentMessage());
          this.submitted = false;
          return;
        }
      })

  }

  public getApplicationById(id: string): void {
    this.applicationService.applicationById(id, this.token)
      .subscribe(r => {
        if (r != undefined) {
          this.application = r;
          if (environment.consoleLog === 'debug')
            console.log('Application :->' + JSON.stringify(this.application));
          this.updateForm(this.application);
        } else {
          this.notifier.notify('error', this.messageService.getMostResentMessage());
        }
      });
  }

  private updateForm(app: Application) {
    this.applicationEditForm.get('id').setValue(app.id);
    this.applicationEditForm.get('access').setValue(app.access);
    this.applicationEditForm.get('name').setValue(app.appName);
    this.applicationEditForm.get('description').setValue(app.description);
    this.applicationEditForm.get('salt').setValue(app.salt);
    this.applicationEditForm.get('onBoardTime').setValue(this.datepipe.transform(new Date(app.onBoardTime), 'yyyy-MM-dd'));
    this.applicationEditForm.get('active').setValue(app.isActive);
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
}
