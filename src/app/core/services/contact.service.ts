import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contacts: any[] = [];

  constructor() {
    this.loadContacts();
  }

  loadContacts() {
    const storedContacts = localStorage.getItem('contacts');
    this.contacts = storedContacts ? JSON.parse(storedContacts) : [];
  }

  getContacts() {
    return this.contacts;
  }

  getContactById(contactId: string) {
    return this.contacts.find(contact => contact.id === contactId);
  }

  addContact(contact: any) {
    this.contacts.push(contact);
    this.saveContacts();
  }

  updateContact(contactId: string, updatedContact: any) {
    const index = this.contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      this.contacts[index] = { ...updatedContact, id: contactId };
      this.saveContacts();
    }
  }

  deleteContact(contactId: string) {
    const index = this.contacts.findIndex(contact => contact.id === contactId);
    if (index !== -1) {
      this.contacts.splice(index, 1);
      this.saveContacts();
    }
  }

  saveContacts() {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }
}
