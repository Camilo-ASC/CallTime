import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: any[] = [];

  constructor(private afs: AngularFirestore) {
    this.loadContacts();
  }

  loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    this.contacts = storedContacts ? JSON.parse(storedContacts) : [];
    this.loadContactsFromFirestore();  // Cargar también desde Firestore
  }

  loadContactsFromFirestore() {
    const auth = getAuth();
    const currentUser = auth.currentUser;
  
    if (!currentUser) {
      console.log('No hay usuario autenticado');
      return;
    }
  
    this.afs
      .collection(`users/${currentUser.uid}/contacts`)
      .get()
      .toPromise()
      .then((snapshot) => {
        const firestoreContacts = snapshot?.docs.map((doc) => {
          const data = doc.data();
          
          // Verificamos que data sea un objeto antes de hacer el spread
          if (data && typeof data === 'object') {
            return { id: doc.id, ...data };
          } else {
            console.warn('Los datos del contacto no son válidos', data);
            return null;
          }
        }).filter(contact => contact !== null); // Filtramos los contactos nulos (si hay alguno)
  
        this.contacts = firestoreContacts || [];
        this.saveContacts(); // Guardar los contactos en localStorage
      })
      .catch((error) => {
        console.error('Error al cargar contactos desde Firestore:', error);
      });
  }

  getContacts() {
    const storedContacts = localStorage.getItem('contacts');
    this.contacts = storedContacts ? JSON.parse(storedContacts) : [];
    return this.contacts;
  }

  getContactById(contactId: string) {
    return this.contacts.find(contact => contact.id === contactId);
  }

  addContact(contact: any) {
    // Guardar en la lista de contactos local
    this.contacts.push(contact);
    
    // Guardar también en localStorage para persistencia local
    this.saveContacts();
    
    // Si quieres sincronizar con Firestore, puedes hacerlo aquí (si ya está implementado)
    this.afs.collection('users').doc(getAuth().currentUser?.uid).collection('contacts').add(contact);
  }
  
  saveContacts() {
    // Asegurarse de que los contactos se guarden correctamente en localStorage
    console.log("Guardando contactos en localStorage:", this.contacts);
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  updateContact(id: string, updatedContact: any) {
    const contacts = this.getContacts();
    const index = contacts.findIndex(c => c.id === id);
    if (index !== -1) {
      contacts[index] = { id, ...updatedContact };
      localStorage.setItem('contacts', JSON.stringify(contacts));
    }
  }

  deleteContact(contactId: string) {
    const index = this.contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.saveContacts();
    }
  }

  async phoneExists(phone: string): Promise<boolean> {
    try {
      const snapshot = await this.afs.collection('users', ref =>
        ref.where('phone', '==', phone)
      ).get()
        .toPromise();

      return !snapshot?.empty;
    } catch (error) {
      console.error('Error al verificar el número en Firestore:', error);
      return false;
    }
  }
}
