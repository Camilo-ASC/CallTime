import { Component } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
import { NotificationService } from './core/services/notification.service'; // Asegúrate de crear este servicio

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform, private notificationService: NotificationService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Solicitar permisos para notificaciones
      PushNotifications.requestPermissions().then((result) => {
        if (result.receive === 'granted') {
          // Registrar el dispositivo para recibir notificaciones
          PushNotifications.register();

          // Suscribirse a los eventos de las notificaciones
          PushNotifications.addListener('registration', (token) => {
            console.log('Token de registro:', token.value);
            // Enviar el token al servicio para guardarlo en Firestore
            this.notificationService.saveTokenInFirestore(token.value);
          });

          PushNotifications.addListener('pushNotificationReceived', (notification) => {
            console.log('Notificación recibida:', notification);
            // Aquí puedes manejar lo que sucede cuando se recibe una notificación
          });
        }
      });
    });
  }
}
