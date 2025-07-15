import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlogService } from '../services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IPost } from '../interfaces/post.interface';

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.page.html',
  styleUrls: ['./post-form.page.scss'],
  imports: [IonicModule, ReactiveFormsModule, CommonModule],  
  standalone: true
})
export class PostFormPage implements OnInit {
  postForm: FormGroup;
  postId: string | null = null;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    this.isEditing = !!this.postId;

    if (this.isEditing && this.postId) {
      const loading = await this.loadingController.create({
        message: 'Carregando post para edição...',
      });
      await loading.present();

      this.blogService.getPost(this.postId).subscribe({
        next: (postData) => {
          this.postForm.patchValue(postData);
          loading.dismiss();
        },
        error: async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Erro',
            message: 'Não foi possível carregar o post para edição: ' + err.message,
            buttons: ['OK']
          });
          await alert.present();
          this.navCtrl.back();
        }
      });
    }
  }

  async onSubmit() {
    if (this.postForm.invalid) {
      const alert = await this.alertController.create({
        header: 'Erro de Validação',
        message: 'Por favor, preencha todos os campos corretamente.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const loading = await this.loadingController.create({
      message: this.isEditing ? 'Atualizando post...' : 'Criando post...',
    });
    await loading.present();

    const post: IPost = this.postForm.value;

    try {
      debugger;
      
      if (this.isEditing && this.postId) {
        await this.blogService.updatePost(this.postId, post).then(obs => obs.toPromise());
      } else {
        await this.blogService.createPost(post).then(obs => obs.toPromise());
      }
      loading.dismiss();
      const successAlert = await this.alertController.create({
        header: 'Sucesso',
        message: `Post ${this.isEditing ? 'atualizado' : 'criado'} com sucesso!`,
        buttons: ['OK']
      });
      await successAlert.present();
      this.router.navigateByUrl('/home', { replaceUrl: true }); // Redireciona para home
    } catch (error: any) {
      loading.dismiss();
      let errorMessage = `Não foi possível ${this.isEditing ? 'atualizar' : 'criar'} o post.`;
      if (error.status === 401 || error.status === 403) { // Unauthorized or Forbidden
        errorMessage = 'Você não tem permissão para realizar esta ação. Faça login com uma conta de administrador/editor.';
      } else if (error.error && error.error.message) {
        errorMessage = `Erro: ${error.error.message}`;
      }
      const errorAlert = await this.alertController.create({
        header: 'Erro',
        message: errorMessage,
        buttons: ['OK']
      });
      await errorAlert.present();
    }
  }
}