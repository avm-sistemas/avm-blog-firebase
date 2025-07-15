import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Auth, user, signOut, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';

import { addIcons } from 'ionicons';
import { logInOutline, logOutOutline, homeOutline, addCircleOutline, trashOutline, createOutline, informationCircleOutline } from 'ionicons/icons';

addIcons({
  logInOutline,
  logOutOutline,
  homeOutline,
  addCircleOutline,
  trashOutline,
  createOutline,
  informationCircleOutline  
});

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonicModule, NgIf],
  standalone: true
})
export class AppComponent implements OnInit, OnDestroy {

  // --- Injeção de Dependências ---
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  private alertController: AlertController = inject(AlertController);
  private toastController: ToastController = inject(ToastController);
  private loadingController: LoadingController = inject(LoadingController);

  // --- Propriedades do Componente ---  
  isLoggedIn: boolean = false; // Estado de login do usuário
  currentUser: User | null = null; // Informações do usuário logado
  isLoading: boolean = false; // Para o spinner de carregamento

  private userSubscription: Subscription | undefined;

  constructor() {}

  ngOnInit() {
    // --- Observar o Estado de Autenticação ---
    // Isso atualiza 'isLoggedIn' e 'currentUser' sempre que o estado de auth muda    
    this.userSubscription = user(this.auth).subscribe(firebaseUser => {
      this.isLoggedIn = !!firebaseUser; // Converte para boolean
      this.currentUser = firebaseUser;
    });
  }

  ngOnDestroy() {
    // --- Cancelar Subscriptions para Evitar Vazamento de Memória ---    
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  // --- Função para Logout do Usuário ---
  async logout() {
    const loading = await this.loadingController.create({
      message: 'Saindo...',
    });
    await loading.present();

    try {
      await signOut(this.auth);
      loading.dismiss();
      const toast = await this.toastController.create({
        message: 'Você saiu com sucesso!',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      this.router.navigateByUrl('/login', { replaceUrl: true }); // Redireciona para login
    } catch (error: any) {
      loading.dismiss();
      console.error("Erro ao sair:", error);
      const toast = await this.toastController.create({
        message: 'Erro ao sair: ' + error.message,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
  async GoHome() {
    this.router.navigateByUrl('/home', { replaceUrl: true }); // Redireciona para login
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
