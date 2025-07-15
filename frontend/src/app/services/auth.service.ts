import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface UserData {
  uid: string;
  email: string | null;
  role?: string | string[]; // Pode ser 'admin', 'editor', 'user' ou um array de strings
  // Outros dados do usuário que você queira armazenar
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$: Observable<User | null>;
  currentCustomClaims$: Observable<any | null>;

  constructor(private auth: Auth) {
    this.currentUser$ = user(this.auth);

    // Observa o usuário e, se logado, busca os custom claims
    this.currentCustomClaims$ = this.currentUser$.pipe(
      switchMap(async user => {
        if (user) {
          try {
            const idTokenResult = await user.getIdTokenResult(true); // true para forçar o refresh e pegar claims atualizadas
            return idTokenResult.claims; // Contém os custom claims definidos no backend
          } catch (error) {
            console.error('Error fetching custom claims:', error);
            return null;
          }
        }
        return null;
      })
    );
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    // Nota: A role inicial 'user' é melhor definida no backend (NestJS ou Cloud Function)
    // usando admin.auth().setCustomUserClaims após o registro, para garantir que não seja manipulada pelo cliente.
    // Ou você pode usar regras do Firestore para proteger a escrita na coleção 'users'.
    return userCredential;
  }

  async logout() {
    return signOut(this.auth);
  }

  // Retorna o ID Token do Firebase, que será enviado para o backend NestJS
  async getToken(): Promise<string | null> {
    const user = await this.auth.currentUser;
    return user ? user.getIdToken() : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.auth.currentUser;
    return !!user;
  }

  // Helper para verificar se o usuário tem uma determinada role
  async hasRole(role: string): Promise<boolean> {
    debugger;
    const claims = await this.currentCustomClaims$.toPromise(); // Convert Observable to Promise
    if (!claims) return false;

    const userRoles = Array.isArray(claims['roles']) ? claims['roles'] : (claims['role'] ? [claims['role']] : []);
    return userRoles.includes(role);
  }
}