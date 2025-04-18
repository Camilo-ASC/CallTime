import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Definir la interfaz Contact
interface Contact {
  id: string;
  name: string;
  phone: string;
}

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
      const newContact: Contact = {
        id: Date.now().toString(), // o usa UUID si prefieres
        name: this.contactForm.value.name ?? '', // Valor predeterminado si es null o undefined
        phone: this.contactForm.value.phone ?? '' // Valor predeterminado si es null o undefined
      };

      // Obtener los contactos desde el LocalStorage
      let contacts: Contact[] = JSON.parse(localStorage.getItem('contacts') || '[]');

      // Verificar si el teléfono ya está registrado
      const existingContact = contacts.find(contact => contact.phone === newContact.phone);

      if (existingContact) {
        // Si el número ya está registrado, mostrar un mensaje de error
        alert('Este número de teléfono ya está registrado.');
      } else {
        // Si el número no está registrado, agregar el nuevo contacto
        alert('Este número no está registrado. Solo se pueden agregar contactos con números registrados.');
      }
    } else {
      // Mostrar algún mensaje de error si el formulario no es válido
      alert('Por favor, complete todos los campos correctamente.');
    }
  }
}
