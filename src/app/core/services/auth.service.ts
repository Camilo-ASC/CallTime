import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  async register(email: string, password: string, data: { name: string; lastname: string; phone: string }) {
    console.log('✅ Registrando usuario...');
    console.log('🧪 AngularFireAuth:', this.afAuth);
    console.log('🧪 AngularFirestore (compat):', this.afs);

    const { name, lastname, phone } = data;

    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = credential.user?.uid;
      console.log('🆔 UID generado:', uid);

      if (uid) {
        await this.afs.collection('users').doc(uid).set({
          uid,
          email,
          name,
          lastname,
          phone
        });
        console.log('✅ Usuario guardado en Firestore correctamente.');
      }

      return credential;
    } catch (error) {
      console.error('❌ Error al registrar usuario:', error);
      throw error;
    }
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut().then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  getCurrentUser() {
    return this.afAuth.currentUser;
  }
}
