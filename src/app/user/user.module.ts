import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ViewComponent } from './view/view.component';
import { NewComponent } from './new/new.component';
import { DetailsComponent } from './details/details.component';


@NgModule({
  declarations: [
    ViewComponent,
    NewComponent,
    DetailsComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
