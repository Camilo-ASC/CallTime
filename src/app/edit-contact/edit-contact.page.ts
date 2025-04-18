import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from 'src/app/core/services/contact.service';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.page.html',
  styleUrls: ['./edit-contact.page.scss'],
  standalone: false
})
export class EditContactPage implements OnInit {
  contactId: string = '';
  contact: any = { name: '', phone: '' };

  constructor(
    private activatedRoute: ActivatedRoute,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
if (id) {
  this.contactId = id;
  this.loadContact();
} else {
  console.error('No se recibió el ID del contacto en la URL');
  this.router.navigate(['home/contact-list']);
}
  }

  loadContact() {
    // Cargar el contacto con el ID
    this.contact = this.contactService.getContactById(this.contactId);
  
    if (!this.contact) {
      // Si no se encuentra el contacto, podrías redirigir o mostrar un mensaje de error
      this.router.navigate(['home/contact-list']);
    }
  }

  saveContact() {
    // Guardar los cambios del contacto
    this.contactService.updateContact(this.contactId, this.contact);
    this.router.navigate(['home/contact-list']);
  }
}
