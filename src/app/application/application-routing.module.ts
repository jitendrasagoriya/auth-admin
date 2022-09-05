import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from '../auth/sign-in/sign-in.component';
import { AddComponent } from './add/add.component';
import { DetailsComponent } from './details/details.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: ViewComponent,
        data: {
          title: 'View All'
        }
      },
      {
        path: 'new',
        component: AddComponent,
        data: {
          title: 'New Application'
        }
      } ,
      {
        path: 'details/:id',
        component: DetailsComponent,
        data: {
          title: 'Details',
          edit:false
        }
      } ,
      {
        path: 'edit/:id',
        component: DetailsComponent,
        data: {
          title: 'Edit',
          edit:true
        }
      } 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
