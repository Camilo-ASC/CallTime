import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) {}

  initPush() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(permission => {
        if (permission.receive === 'granted') {
          PushNotifications.register();
        }
      });

      PushNotifications.addListener('registration', async token => {
        console.log('Token de notificación:', token.value);
        await this.saveTokenToFirestore(token.value);
      });

      PushNotifications.addListener('registrationError', err => {
        console.error('Error de registro de notificaciones:', err);
      });

      PushNotifications.addListener('pushNotificationReceived', notification => {
        console.log('Notificación recibida en foreground:', notification);
        // Aquí podrías mostrar un toast o modal
      });
    }
  }

  async saveTokenToFirestore(token: string) {
    const user = await this.authService.getCurrentUser();
    if (user?.uid) {
      try {
        await this.firestore.collection('users').doc(user.uid).set({ token }, { merge: true });
        console.log('Token guardado en Firestore');
      } catch (error) {
        console.error('Error guardando token en Firestore:', error);
      }
    } else {
      console.warn('No hay usuario autenticado. Token no guardado.');
    }
  }
}
