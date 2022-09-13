import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import {NgModalUserDeleteConfirm, ViewComponent} from './view/view.component';
import { NewComponent } from './new/new.component';
import { DetailsComponent } from './details/details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";
import {EditComponent, NgModalUserEditConfirm} from './edit/edit.component';


@NgModule({
  declarations: [
    ViewComponent,
    NewComponent,
    DetailsComponent,
    EditComponent,
    NgModalUserEditConfirm,
    NgModalUserDeleteConfirm
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgbModule,
    AutocompleteLibModule,
    ReactiveFormsModule,
    FormsModule,
    PerfectScrollbarModule,

  ],
  providers:[
    DatePipe
  ]
})
export class UserModule { }
