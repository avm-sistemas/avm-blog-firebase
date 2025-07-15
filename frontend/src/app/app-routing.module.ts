/*
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'post/:id',
    loadChildren: () => import('./post-detail/post-detail.module').then(m => m.PostDetailPageModule)
  },
  {
    path: 'create-post',
    loadChildren: () => import('./post-form/post-form.module').then(m => m.PostFormPageModule),
    canLoad: [AuthGuard] // Protege a rota de criação de post
  },
  {
    path: 'edit-post/:id',
    loadChildren: () => import('./post-form/post-form.module').then(m => m.PostFormPageModule),
    canLoad: [AuthGuard] // Protege a rota de edição de post
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
*/