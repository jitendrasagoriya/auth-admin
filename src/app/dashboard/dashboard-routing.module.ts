import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
import { ECommerceComponent } from './e-commerce/e-commerce.component'; 

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ECommerceComponent,
        data: {
          title: 'DashBoard'
        }
      }       
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
