import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Auth, user, signOut, User, getAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment.ci';
import { IPost } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = environment.apiUrl + 'posts'; // VERIFIQUE A PORTA DO SEU BACKEND NESTJS

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Requisições para todos (GET) não precisam de token
  getPosts(): Observable<IPost[]> {
    return this.http.get<IPost[]>(this.apiUrl);
  }

  getPost(id: string): Observable<IPost> {
    return this.http.get<IPost>(`${this.apiUrl}/${id}`);
  }

  // Requisições para incluir/editar/excluir posts precisam de autenticação  
  async createPost(post: IPost): Promise<Observable<IPost>> {
    debugger;
    const token = await this.authService.getToken();
    if (!token) throw new Error('User not authenticated.');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<IPost>(this.apiUrl, post, { headers });
  }

  async updatePost(id: string, post: IPost): Promise<Observable<IPost>> {
    const token = await this.authService.getToken();
    if (!token) throw new Error('User not authenticated.');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<IPost>(`${this.apiUrl}/${id}`, post, { headers });
  }

  async deletePost(id: string): Promise<Observable<void>> {
    const token = await this.authService.getToken();
    if (!token) throw new Error('User not authenticated.');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
}