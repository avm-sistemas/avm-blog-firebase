import { ApplicationConfig } from "@angular/core";
import { PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Importações do Firebase
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAnalytics } from "firebase/analytics";
import { provideAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { routes } from "./app.routes";
import { environment } from "src/environments/environment.ci";
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    provideRouter(routes, withPreloading(PreloadAllModules)), 
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()), 
    provideAnalytics(() => getAnalytics()), ScreenTrackingService, UserTrackingService, 
    provideFirestore(() => getFirestore()),
    provideHttpClient(),    
  ],
};
