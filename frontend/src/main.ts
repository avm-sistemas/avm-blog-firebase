import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { addIcons } from 'ionicons';
import { logInOutline, homeOutline, addCircleOutline, trashOutline, createOutline, informationCircleOutline } from 'ionicons/icons';

addIcons({
  logInOutline,
  homeOutline,
  addCircleOutline,
  trashOutline,
  createOutline,
  informationCircleOutline
  // Adicione todos os ícones que você usa em seus templates aqui
});


bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
