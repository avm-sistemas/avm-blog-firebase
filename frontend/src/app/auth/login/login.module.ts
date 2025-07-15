import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- Adicione essas linhas

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-page-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    IonicModule,    
    HttpClientModule,
    LoginPageRoutingModule,
  ],
})
export class LoginPageModule {}