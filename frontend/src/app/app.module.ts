/*
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Importações do Firebase
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';

@NgModule({
  //declarations: [AppComponent],
  imports: [
    AppComponent,
    BrowserModule,
    IonicModule.forRoot(),    
    HttpClientModule,
    AppRoutingModule,    
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // --- Configuração do Firebase usando useFactory e FIREBASE_OPTIONS ---
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase }, // <-- Fornece as opções do Firebase estaticamente
    // Agora, os provide* usam as funções que você já tem, mas com um contexto mais claro para o AOT
    provideFirebaseApp(() => initializeApp(environment.firebase)), // <--- Note que essa linha permanece
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideHttpClient(),    
    // --- Fim da Configuração do Firebase ---
  ],
  //bootstrap: [AppComponent],
})
export class AppModule {}
*/