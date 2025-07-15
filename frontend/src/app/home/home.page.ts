import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Para routerLink
import { FormsModule } from '@angular/forms'; // Se usar ngModel ou outros formulários simples
import { Router } from '@angular/router'; // Para navegação programática

// --- Importações do Ionic ---
import { IonicModule, AlertController, ToastController, LoadingController } from '@ionic/angular';

// --- Importações do Firebase ---
import { Auth, user, signOut, User } from '@angular/fire/auth'; // user() para observable do usuário
import { Firestore, collection, collectionData, query, orderBy, deleteDoc, doc } from '@angular/fire/firestore'; // Para Firestore
import { Observable, Subscription } from 'rxjs'; // Para observables e gerenciamento de subscriptions
import { finalize, tap } from 'rxjs/operators'; // Para operadores de pipe
import { addIcons } from 'ionicons';
import { logInOutline, logOutOutline, homeOutline, addCircleOutline, trashOutline, createOutline, informationCircleOutline } from 'ionicons/icons';
import { IBlogPost } from '../interfaces/blog-post.interface';

addIcons({
  logInOutline,
  logOutOutline,
  homeOutline,
  addCircleOutline,
  trashOutline,
  createOutline,
  informationCircleOutline
  // Adicione todos os ícones que você usa em seus templates aqui
});


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // Define este componente como standalone
  imports: [
    CommonModule,
    RouterModule, // Para usar routerLink
    FormsModule,  // Se houver algum ngModel simples no HTML
    IonicModule   // Para todos os componentes ion-*
  ],
})
export class HomePage implements OnInit, OnDestroy {
  // --- Injeção de Dependências ---
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private alertController: AlertController = inject(AlertController);
  private toastController: ToastController = inject(ToastController);
  private loadingController: LoadingController = inject(LoadingController);

  // --- Propriedades do Componente ---
  posts: IBlogPost[] = []; // Array para armazenar os posts
  isLoggedIn: boolean = false; // Estado de login do usuário
  currentUser: User | null = null; // Informações do usuário logado
  isLoading: boolean = false; // Para o spinner de carregamento

  private userSubscription: Subscription | undefined;
  private postsSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit() {
    // --- Observar o Estado de Autenticação ---
    // Isso atualiza 'isLoggedIn' e 'currentUser' sempre que o estado de auth muda
    this.userSubscription = user(this.auth).subscribe(firebaseUser => {
      this.isLoggedIn = !!firebaseUser; // Converte para boolean
      this.currentUser = firebaseUser;
      if (this.isLoggedIn) {
        this.loadPosts(); // Carrega os posts apenas se o usuário estiver logado ou se precisar de permissão
      } else {
        // Se deslogado, pode limpar os posts ou carregar posts públicos
        this.loadPosts(); // Carrega posts mesmo sem login para visualização pública
      }
    });
  }

  ngOnDestroy() {
    // --- Cancelar Subscriptions para Evitar Vazamento de Memória ---
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.postsSubscription) {
      this.postsSubscription.unsubscribe();
    }
  }

  // --- Carregar Posts do Firestore ---
  async loadPosts() {
    this.isLoading = true;
    const postsCollection = collection(this.firestore, 'posts');
    const q = query(postsCollection, orderBy('createdAt', 'desc')); // Ordena por data de criação

    // Obtém os dados da coleção em tempo real
    this.postsSubscription = (collectionData(q, { idField: 'id' }) as Observable<IBlogPost[]>)
      .pipe(
        // Opcional: Adicionar lógica para obter o nome do autor de outra coleção se necessário
        // Por enquanto, assumimos que authorName está no próprio post
        tap(() => this.isLoading = false), // Esconde o spinner quando os dados chegam
        finalize(() => this.isLoading = false) // Garante que o spinner é escondido mesmo em caso de erro
      )
      .subscribe({
        next: (data) => {
          this.posts = data;
        },
        error: async (err) => {
          console.error("Erro ao carregar posts:", err);
          const toast = await this.toastController.create({
            message: 'Erro ao carregar os posts.',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
          this.isLoading = false;
        }
      });
  }

  // --- Função para Excluir um Post ---
  async deletePost(postId?: string) {
    if (!postId) {
      this.presentToast('ID do post inválido para exclusão.', 'warning');
      return;
    }

    // Confirmação via Alert
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja excluir este post?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Excluindo post...',
            });
            await loading.present();

            try {
              // Verifica se o usuário atual é o autor do post (opcional, mas recomendado para segurança)
              // Você precisaria de uma query para obter o post e verificar authorId
              // Por simplicidade aqui, assume-se que a regra de segurança do Firestore (Security Rules)
              // já lida com a permissão de exclusão baseada no autor.
              await deleteDoc(doc(this.firestore, 'posts', postId));
              loading.dismiss();
              this.presentToast('Post excluído com sucesso!', 'success');
              // A lista de posts será atualizada automaticamente via observável do Firestore
            } catch (error: any) {
              loading.dismiss();
              console.error("Erro ao excluir post:", error);
              this.presentToast('Erro ao excluir post: ' + error.message, 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // --- Método Auxiliar para Apresentar Toasts ---
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }
}