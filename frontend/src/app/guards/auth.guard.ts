import { Injectable } from '@angular/core';
import { CanLoad, Router, UrlTree, UrlSegment, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser$.pipe(
      take(1), // Pega o primeiro valor e completa
      map(user => {
        if (user) {
          // Opcional: Verifique roles aqui também, se a rota for restrita a roles específicas
          // Ex: if (route.data && route.data['roles'] && !this.authService.hasRole(route.data['roles'])) { ... }
          return true;
        } else {
          // Redireciona para a página de login se não estiver autenticado
          return this.router.createUrlTree(['/login']);
        }
      })
    );
  }
}