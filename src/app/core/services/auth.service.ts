import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from 'firebase/auth'; // Opcional para tipado
import { Platform } from '@ionic/angular';
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private platform: Platform
  ) {}

  /**
   * ✨ Registro de usuario
   */
  async register(email: string, password: string, data: { name: string; lastname: string; phone: string }) {
    const { name, lastname, phone } = data;

    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user?.uid;

    if (uid) {
      await this.afs.collection('users').doc(uid).set({
        uid,
        email,
        name,
        lastname,
        phone
      });
    }

    return credential;
  }

  /**
   * 🔐 Login de usuario
   */
  async login(email: string, password: string) {
    try {
      const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Inicio de sesión exitoso:', userCredential.user?.uid);
      return userCredential;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * 🔒 Obtiene el usuario actualmente autenticado
   */
  getCurrentUser(): User | null {
    return this.afAuth.currentUser as unknown as User | null;
  }

  /**
   * 🚪 Cierra sesión del usuario y redirige al login
   */
  async logout() {
    await this.afAuth.signOut();
    this.router.navigate(['/auth/login']);
  }

  async saveFcmToken(uid: string): Promise<void> {
    if (!this.platform.is('capacitor')) return;
  
    try {
      const permission = await PushNotifications.requestPermissions();
      if (permission.receive !== 'granted') {
        console.warn('Permisos de notificaciones no concedidos');
        return;
      }
  
      await PushNotifications.register();
  
      PushNotifications.addListener('registration', async (token) => {
        console.log('Token FCM obtenido:', token.value);
        await this.afs.collection('users').doc(uid).set({ fcmToken: token.value }, { merge: true });
      });
  
      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error de registro FCM:', error);
      });
  
    } catch (error) {
      console.error('Error al guardar token FCM:', error);
    }
  }

}
