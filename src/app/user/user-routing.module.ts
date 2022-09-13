import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { NewComponent } from './new/new.component';
import { ViewComponent } from './view/view.component';
import {EditComponent} from "./edit/edit.component";

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'view',
        component: ViewComponent,
        data: {
          title: 'View All'
        }
      },
      {
        path: 'new',
        component: NewComponent,
        data: {
          title: 'New User'
        }
      } ,
      {
        path: 'details/:id',
        component: DetailsComponent
      } ,
      {
        path: 'edit/:id',
        component: EditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
