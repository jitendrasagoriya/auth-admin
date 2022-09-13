import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {ApplicationUser} from "../../entity/applicationUserResponse";
import {MessageService} from "../../http/message.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../user.service";
import {NotifierService} from "angular-notifier";
import {environment} from "../../../environments/environment";
import {NgModalUserEditConfirm} from "../edit/edit.component";

@Component({
  selector: 'ng-modal-user-delete-confirm',
  template: `
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Confirmation!!</h4>
    <button type="button" class="btn-close" aria-describedby="modal-title" (click)="modal.dismiss('Cross click')"></button>
  </div>
  <div class="modal-body">
    <p><strong>Are you sure you want to delete User?</strong></p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss('cancel click')">Cancel</button>
    <button type="button" class="btn btn-danger" (click)="modal.close('Ok click')">Ok</button>
  </div>
  `
})
export class NgModalUserDeleteConfirm {
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
  originalApplicationUser = [] as ApplicationUser [];
  applicationUsers = [] as ApplicationUser [];
  searchApplication = [] as ApplicationUser [];
  currentPage = 1;
  pageSize = 5;
  totalDataSize:number=  0;
  isSearched:boolean = false;

  constructor( private messageService: MessageService, private spinner: NgxSpinnerService,
                private modalService: NgbModal,private  userService:UserService,private notifier: NotifierService) { }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.spinner.show().then(r => {});
    this.getUserByAdminId();
    if (environment.consoleLog === 'debug')
      console.log('Data Size :->' + this.totalDataSize);
  }


  public getUserByAdminId(): void {
    this.userService.getUserByAdmin(this.token)
      .subscribe( (response) => {
          this.originalApplicationUser = response;
          this.totalDataSize = this.originalApplicationUser.length;
          this.paging(this.originalApplicationUser)
          this.spinner.hide().then(r => {});
        },
        (error) => {
          this.notifier.notify('error',error);
          this.spinner.hide().then(r => {});
        })
  }
  pageChanged(pageNumber: number):void {
    this.currentPage = pageNumber;
    this.paging(this.originalApplicationUser);
  }


  paging(data: ApplicationUser[]): void {
    this.applicationUsers = [];
    if (data == undefined || data.length == 0)
      return;
    let counter = (this.currentPage - 1) * this.pageSize;

    let endIndex = (this.pageSize * this.currentPage);
    if (endIndex > this.totalDataSize)
      endIndex = this.totalDataSize;

    for (let i = counter; i < endIndex; i++) {
      this.applicationUsers.push(data[i]);
    }
  }

  searchName(event: any) {
    try {
      console.log('Search Stirng - >' + event.target.value);
      if( event.target.value.length == 0 ){
        this.isSearched = false;
        this.totalDataSize = this.originalApplicationUser.length;
        this.currentPage = 1;
        this.paging(this.originalApplicationUser)
        return;
      }
      let result = this.originalApplicationUser;
      if (this.isSearched) {
        result = this.searchApplication;
      }
      this.isSearched = true;
      this.searchApplication = result ? result.filter(item => item.name.search(new RegExp(event.target.value)) > -1) : []
      this.totalDataSize = this.searchApplication.length;
      this.currentPage = 1;
      this.paging(this.searchApplication);
    } catch (error) {
      console.error(error);
    }
  }

  changeSize(event: any) {
    this.pageSize = event.target.value;
    let result = this.originalApplicationUser;
    this.paging(result);
  }

  onDelete(id: string):void {
    this.modalService.open(NgModalUserDeleteConfirm).result.then((result) => {
      this.delete(id);
    }, (reason) => {
      console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  delete(id:string):void {
    const spinnerName = "delete"
    this.spinner.show(spinnerName).then(r => {})
    this.userService.delete(this.token,id)
      .subscribe((response) => {
        if (response.errorCode != undefined && response.errorCode != 200) {
          this.notifier.notify('error', response.errorMessage?response.errorMessage:'Something went wrong.Please try some time later.');
          this.spinner.hide(spinnerName).then(r => {});
        } else {
          this.notifier.notify('success', 'User has been successfully deleted!!!');
          this.userService.getUserByAdmin(this.token)
            .subscribe( (response) => {
                this.originalApplicationUser = response;
                this.totalDataSize = this.originalApplicationUser.length;
                this.paging(this.originalApplicationUser) ;
                this.spinner.hide(spinnerName).then(r => {});
              },
              (error) => {
                this.notifier.notify('error',error);
                this.spinner.hide(spinnerName).then(r => {});
              });
        }
      },(e) => {
        this.notifier.notify('error', e);
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
  view(applicationUser: ApplicationUser):void {
    alert(JSON.stringify(applicationUser));
  }

  edit(applicationUser: ApplicationUser):void {
    alert(JSON.stringify(applicationUser));

  }
}
