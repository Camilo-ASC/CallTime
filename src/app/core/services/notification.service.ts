import { Injectable } from '@angular/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Para obtener el usuario autenticado

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  async saveTokenInFirestore(token: string) {
    const db = getFirestore();
    const user = getAuth().currentUser; // Obtiene el usuario autenticado

    if (user) {
      const userDocRef = doc(db, 'users', user.uid); // Guardar en el documento de usuario
      await setDoc(userDocRef, {
        token: token
      }, { merge: true });
      console.log('Token guardado en Firestore');
    } else {
      console.log('No hay usuario autenticado para guardar el token');
    }
  }
}
