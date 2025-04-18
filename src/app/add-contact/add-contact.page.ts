import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false
})
export class AddContactPage {
  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  saveContact() {
    if (this.contactForm.valid) {
      const newContact = {
        id: Date.now().toString(), // o usa UUID si prefieres
        ...this.contactForm.value
      };
  
      // Guarda el nuevo contacto en LocalStorage
      let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      contacts.push(newContact);
      localStorage.setItem('contacts', JSON.stringify(contacts));
  
      // Navega de vuelta a la página de contactos
      this.router.navigate(['home/contact-list']);
    } else {
      // Mostrar algún mensaje de error si el formulario no es válido
    }
  }
}
