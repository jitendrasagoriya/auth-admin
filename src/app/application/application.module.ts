import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ViewComponent } from './view/view.component';
import { DetailsComponent } from './details/details.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddComponent } from './add/add.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

 

@NgModule({
  declarations: [
    ViewComponent,
    DetailsComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
  ],
  providers:[
    DatePipe
  ]
})
export class ApplicationModule { }
