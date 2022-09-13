import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import {NgModalUserDetailsEditConfirm, UserProfileComponent} from './user-profile.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PerfectScrollbarModule} from "ngx-perfect-scrollbar";


@NgModule({
  declarations: [UserProfileComponent,NgModalUserDetailsEditConfirm],
  imports: [
    CommonModule,
    UserProfileRoutingModule,
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
export class UserProfileModule { }
