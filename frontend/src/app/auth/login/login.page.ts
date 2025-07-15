import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf, *ngFor, etc. no template
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para formulários reativos
import { Router } from '@angular/router'; // Para navegação

// --- Importações Específicas do Ionic ---
import { IonicModule, ToastController, LoadingController } from '@ionic/angular'; // IonicModule para componentes ion-*, Toast/Loading para feedback ao usuário
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonText, IonIcon } from '@ionic/angular/standalone'; // Se você estiver importando componentes Ionic individuais (menos comum com IonicModule completo)
// Nota: Se você usa 'IonicModule' no 'imports' do @Component, você não precisa importar cada IonComponent individualmente acima.

// --- Importações do Firebase Authentication ---
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from '@angular/fire/auth'; // Métodos de autenticação Firebase

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Define este componente como standalone
  imports: [
    CommonModule,
    ReactiveFormsModule, // Essencial para formulários reativos
    IonicModule, // Importa o módulo Ionic para acesso a todos os componentes ion-*
    // Se você não estivesse importando o IonicModule completo, você listaria os componentes aqui:
    // IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonText, IonIcon
  ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup; // ! indica que será inicializado no ngOnInit
  errorMessage: string | null = null; // Para exibir mensagens de erro do login

  // Injeção de dependências
  private auth: Auth = inject(Auth); // Injeta o serviço Auth do Firebase
  private formBuilder: FormBuilder = inject(FormBuilder); // Injeta o FormBuilder para criar formulários
  private router: Router = inject(Router); // Injeta o Router para navegação
  private toastController: ToastController = inject(ToastController); // Injeta ToastController para mensagens curtas
  private loadingController: LoadingController = inject(LoadingController); // Injeta LoadingController para indicadores de carregamento

  constructor() {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // --- Método de Login com Email e Senha ---
  async loginUser() {
    this.errorMessage = null; // Limpa qualquer erro anterior
    if (this.loginForm.invalid) {
      // O formulário está inválido, as mensagens de erro no HTML já lidam com isso.
      // Opcional: mostrar um toast informando para preencher os campos.
      const toast = await this.toastController.create({
        message: 'Por favor, preencha todos os campos corretamente.',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Autenticando...',
    });
    await loading.present();

    const { email, password } = this.loginForm.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      loading.dismiss();
      this.presentToast('Login bem-sucedido!', 'success');
      this.router.navigateByUrl('/home', { replaceUrl: true }); // Navega para a home após o login
    } catch (error: any) {
      loading.dismiss();
      this.errorMessage = this.getErrorMessage(error.code); // Traduz o código de erro do Firebase
      this.presentToast(this.errorMessage, 'danger');
    }
  }

  // --- Método de Login com Google (Opcional) ---
  async loginWithGoogle() {
    this.errorMessage = null; // Limpa qualquer erro anterior
    const loading = await this.loadingController.create({
      message: 'Autenticando com Google...',
    });
    await loading.present();

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      loading.dismiss();
      this.presentToast('Login com Google bem-sucedido!', 'success');
      console.log(this.auth.currentUser);

      this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error: any) {
      loading.dismiss();
      this.errorMessage = this.getErrorMessage(error.code);
      this.presentToast(this.errorMessage, 'danger');
    }
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

  // --- Método Auxiliar para Traduzir Erros do Firebase ---
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Usuário desativado.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique seu email.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/invalid-credential': // Para erros genéricos de credencial (Firebase 9+)
        return 'Credenciais inválidas. Verifique seu email e senha.';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso.';
      case 'auth/account-exists-with-different-credential':
        return 'Já existe uma conta com este email, mas com outro método de login.';
      case 'auth/popup-closed-by-user':
        return 'Autenticação com Google cancelada.';
      default:
        return `Ocorreu um erro: ${errorCode}.`;
    }
  }
}