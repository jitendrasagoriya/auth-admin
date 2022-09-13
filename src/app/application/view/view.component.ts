import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from 'ngx-spinner';
import { Application } from 'src/app/entity/dashboardResponce';
import { MessageService } from 'src/app/http/message.service';
import { environment } from 'src/environments/environment';
import { ApplicationService } from '../application.service';



@Component({
  selector: 'ngbd-modal-delete-confirm',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Confirmation!!</h4>
    <button type="button" class="btn-close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')"></button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to delete application?</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('User canceled!!')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class NgbdModalDeleteConfirm {
  constructor(public modal: NgbActiveModal) { }
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {
  filterForm: FormGroup;
  isLoggedIn: boolean = false;
  token: string;
  applications: Application[] = [];
  originalApplication: Application[] = [];
  searchApplication: Application[] = [];
  isPageingOn: boolean = false;
  submitted: boolean = false;
  currentPage = 1;
  pageSize = 5;
  totalDataSize;
  isSearched = false;

  constructor(private router: Router, private applicationService: ApplicationService, private modalService: NgbModal,
    private route: ActivatedRoute, private notifier: NotifierService,
    private formBuilder: FormBuilder,
    private messageService: MessageService, private spinner: NgxSpinnerService) {
    this.filterForm = this.formBuilder.group({
      active: [''],
      toDate: [''],
      fromDate: ['']
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = Boolean(localStorage.getItem('isLoggedIn'));
    if (environment.consoleLog === 'debug')
      console.log('IsLoggedIn :->' + this.isLoggedIn);

    if (!this.isLoggedIn) {
      this.router.navigate(['/auth/sign-in'], { relativeTo: this.route.parent });
    } else {
      this.token = localStorage.getItem('token');
      this.spinner.show();
      this.getList();
      this.isPageingOn = this.applications.length > this.pageSize;

    }
  }

  public onFilter(): void {

    const statusFilter = this.filterForm.controls['active'].value;
    const toDateFilter = this.filterForm.controls['toDate'].value;
    const toFromFilter = this.filterForm.controls['fromDate'].value;
    if (environment.consoleLog === 'debug')
      console.log('onFilter -> statusFilter :->' + statusFilter);

    this.isSearched = true;
    this.searchApplication = this.originalApplication.filter(a => {
      if ('true' === statusFilter) {
        return a.isActive == Boolean(statusFilter)
      } else {
        return a.isActive != Boolean(statusFilter)
      }
    });

    this.totalDataSize = this.searchApplication.length;
    this.currentPage = 1;
    this.pageing(this.searchApplication);
  }

  changeSize(event: any):void {
    this.pageSize = event.target.value;
    let result = this.originalApplication;
      if (this.isSearched) {
        result = this.searchApplication;
      }
    this.pageing(result);
  }

  pageChanged(pageNumber: number): void {
    this.currentPage = pageNumber;
    if (this.isSearched)
      this.pageing(this.searchApplication);
    else
      this.pageing(this.originalApplication);
  }

  pageing(data: Application[]): void {
    this.applications = [];
    if (data == undefined || data.length == 0)
      return;

    let counter = (this.currentPage - 1) * this.pageSize;

    let endIndex = (this.pageSize * this.currentPage);
    if (endIndex > this.totalDataSize)
      endIndex = this.totalDataSize;

    for (let i = counter; i < endIndex; i++) {
      this.applications.push(data[i]);
    }
  }


  searchName(event: any): void {
    try {
      console.log('Search Stirng - >' + event.target.value);
      if( event.target.value.length == 0 ){
        this.isSearched = false;
        this.totalDataSize = this.originalApplication.length;
      this.currentPage = 1;
        this.pageing(this.originalApplication)
        return;
      }
      let result = this.originalApplication;
      if (this.isSearched) {
        result = this.searchApplication;
      }
      this.isSearched = true;
      this.searchApplication = result ? result.filter(item => item.appName.search(new RegExp(event.target.value)) > -1) : []
      this.totalDataSize = this.searchApplication.length;
      this.currentPage = 1;
      this.pageing(this.searchApplication);
    } catch (error) {
      console.error(error);
    }
  }

  clear(): void {
    this.isSearched = false;
    this.applications = this.originalApplication;
    this.totalDataSize = this.originalApplication.length;
    this.searchApplication = [];
    this.pageing(this.originalApplication);
  }


  public deleteApp(id: string) {
    this.modalService.open(NgbdModalDeleteConfirm).result.then((result) => {
      this.applicationService.delete(id, this.token)
        .subscribe(res => {
          if (res) {
            this.spinner.show();
            this.getList();
          } else {
            this.notifier.notify('error', this.messageService.getMostResentMessage());
            return;
          }
        });
    }, (reason) => {
      this.notifier.notify('info', this.getDismissReason(reason));
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return ` ${reason}`;
    }
  }


  public getList(): void {
    this.applicationService.applicationList(this.token)
      .subscribe(r => {
        this.spinner.hide();
        if (r != undefined) {
          this.originalApplication = r;
          this.pageing(this.originalApplication);
          this.totalDataSize = this.originalApplication.length;
          if (environment.consoleLog === 'debug')
            console.log('Response :-> ' + JSON.stringify(r));
        } else {
          this.notifier.notify('error', this.messageService.getMostResentMessage());
          return;
        }
      })
  }

  public viewApplication(id: string) {
    this.router.navigate(['/application/details/', id]);
  }


}
