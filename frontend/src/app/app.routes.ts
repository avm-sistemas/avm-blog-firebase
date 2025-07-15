import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },    
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'post-detail/:id',
    loadComponent: () => import('./post-detail/post-detail.page').then( m => m.PostDetailPage)
  },
  {
    path: 'post-form',
    loadComponent: () => import('./post-form/post-form.page').then( m => m.PostFormPage)
  }
];
