import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertController,NavController} from '@ionic/angular';
import { AuthService } from '../../common/services/auth.service';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonSpinner, IonButtons, IonButton, IonIcon, IonImg , IonCardHeader, IonCardContent, IonCardTitle} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonLabel,
    IonList,
    IonItem,
    IonCard,
    IonInput,
    IonSpinner,
    IonButtons,
    IonButton,
    IonIcon,
    IonImg,
    IonCardHeader,
    IonCardContent,
    IonCardTitle
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
   password: string = ''; // Contraseña ingresada
  isLoggedIn: boolean = false; // Estado de sesión

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}





// Método de Login
  login() {
    if (this.password === 'fiesta') {
      // Alerta de bienvenida
      window.alert('Bienvenido Ruben Emilio Clerci');

      // Redirige al home
      this.navCtrl.navigateForward('/home'); // Cambia '/home' por la ruta deseada
    } else {
      // Alerta de error
      window.alert('Contraseña incorrecta. Inténtalo de nuevo.');
    }
  }

  
}
