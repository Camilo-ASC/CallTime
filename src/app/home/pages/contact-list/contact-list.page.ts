import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ContactService } from 'src/app/core/services/contact.service';

interface Contact {
  id: string;
  name: string;
  phone: string;
}

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
  standalone: false
})
export class ContactListPage {
  contacts: any[] = [];

  constructor(private contactService: ContactService, private navCtrl: NavController) {}

  ionViewWillEnter() {
    this.loadContacts(); // Esto se ejecuta cada vez que entras a esta vista
  }

  loadContacts() {
    this.contacts = this.contactService.getContacts();
    console.log("Contactos cargados desde el servicio:", this.contacts); // Verificar qué contactos se están cargando
  }

  editContact(contact: any) {
    this.navCtrl.navigateForward(['/edit-contact', contact.id]);
  }

  deleteContact(contactId: string) {
    console.log(`Eliminando contacto con ID: ${contactId}`); // Log de eliminación
    this.contactService.deleteContact(contactId);
    this.loadContacts();
  }
}
