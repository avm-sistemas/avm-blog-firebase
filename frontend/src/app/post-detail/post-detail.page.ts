import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../services/blog.service';
import { NavController, LoadingController, AlertController, IonicModule } from '@ionic/angular';
import { DatePipe, NgIf } from '@angular/common';
import { IBlogPost } from '../interfaces/blog-post.interface';
import { BlogPost } from '../models/blog-post.model';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.page.html',
  styleUrls: ['./post-detail.page.scss'],
  imports: [IonicModule, NgIf, DatePipe],  
  standalone: true
})
export class PostDetailPage implements OnInit {
  post: IBlogPost | null = null;  
  postId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id');
    if (this.postId) {
      const loading = await this.loadingController.create({
        message: 'Carregando post...',
      });
      await loading.present();

      this.blogService.getPost(this.postId).subscribe({
        next: (data: any) => {          
          const postData = new BlogPost();
          postData.authorEmail = data.authorEmail;
          postData.authorId = data.authorId;
          postData.authorName = data.authorName;
          postData.content = data.content;
          postData.createdAt = Date.parse(data.createdAt);
          postData.title = data.title;
          this.post = postData;
          loading.dismiss();
        },
        error: async (err) => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Erro',
            message: 'Não foi possível carregar o post: ' + err.message,
            buttons: ['OK']
          });
          await alert.present();
          this.navCtrl.back(); // Volta para a página anterior se o post não for encontrado
        }
      });
    }
  }

  goBack() {
    this.navCtrl.back();
  }
}