import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toasController: ToastController
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async register() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;

    const { name, lastname, phone, email, password } = this.registerForm.value;

    try {
      await this.authService.register(email, password, { name, lastname, phone });
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      const toast = await this.toasController.create({
        message: 'Ocurrió un error al registrar. Intenta nuevamente.',
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
      // Puedes mostrar un toast aquí
    } finally {
      this.isLoading = false;
    }
  }
}
