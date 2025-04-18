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

  // Actualización del método para aceptar un objeto en vez de múltiples parámetros
  async register(email: string, password: string, data: { name: string; lastname: string; phone: string }) {
    const { name, lastname, phone } = data; // Desestructuramos el objeto recibido

    // Crear usuario con correo y contraseña
    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
    const uid = credential.user?.uid;

    if (uid) {
      // Si el uid es válido, guardar los datos adicionales en Firestore
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
