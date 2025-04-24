import { Injectable } from '@angular/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private firestore: Firestore, private authService: AuthService) {}

  initPush() {
    if (Capacitor.isNativePlatform()) {
      PushNotifications.requestPermissions().then(permission => {
        if (permission.receive === 'granted') {
          PushNotifications.register();
        }
      });

      PushNotifications.addListener('registration', token => {
        console.log('Token de notificación:', token.value);
        this.saveTokenToFirestore(token.value);
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
    const user = await this.authService.getCurrentUser(); // Asegúrate de que devuelva el UID
    if (user?.uid) {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, { token }, { merge: true });
    }
  }
}
