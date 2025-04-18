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
export class ContactListPage implements OnInit {
  contacts: any[] = [];

  constructor(private contactService: ContactService, private navCtrl: NavController) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contacts = this.contactService.getContacts();
  }

  editContact(contact: any) {
    this.navCtrl.navigateForward('/edit-contact', {
      queryParams: { contactId: contact.id },
    });
  }

  deleteContact(contactId: string) {
    this.contactService.deleteContact(contactId);
    this.loadContacts(); // Recargar la lista de contactos
  }
}
