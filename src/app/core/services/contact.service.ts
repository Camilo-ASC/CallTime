import { Injectable } from '@angular/core';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contacts: Contact[] = [];

  constructor() {
    this.loadContacts();
  }

  loadContacts() {
    // Cargar los contactos desde LocalStorage
    const savedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    this.contacts = savedContacts;
  }

  getContacts() {
    return this.contacts;
  }

  // Agregar un contacto
  addContact(contact: Contact) {
    this.contacts.push(contact);
    this.updateLocalStorage();
  }

  // Editar un contacto
  editContact(updatedContact: Contact) {
    const index = this.contacts.findIndex(contact => contact.id === updatedContact.id);
    if (index !== -1) {
      this.contacts[index] = updatedContact;
      this.updateLocalStorage();
    }
  }

  // Eliminar un contacto
  deleteContact(contactId: string) {
    this.contacts = this.contacts.filter(contact => contact.id !== contactId);
    this.updateLocalStorage();
  }

  // Actualizar el LocalStorage
  private updateLocalStorage() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
}
