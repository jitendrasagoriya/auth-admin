import { ApplicationModule } from '@angular/core';
import { Routes } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('../../dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'application',
        loadChildren: () => import('../../application/application.module' ).then(m => m.ApplicationModule)
    },
    {
        path: 'user',
        loadChildren: () => import('../../user/user.module' ).then(m => m.UserModule)
    },
    {
      path:'user-profile',
      loadChildren:() => import('../../user-profile/user-profile.module').then(m => m.UserProfileModule)
    },
    {
        path: 'error',
        loadChildren: () => import('./../../error/error.module').then(m => m.ErrorModule)
    },
];
