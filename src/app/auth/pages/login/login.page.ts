import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';  // Agregado
import { AuthService } from 'src/app/core/services/auth.service';  // Asegúrate de tener el servicio
import { Router } from '@angular/router';  // Para redirigir después del login

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup; // Definir el formulario
  isLoading = false; // Estado para mostrar el spinner o deshabilitar el botón

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,  // El servicio para manejar login
    private router: Router
  ) { }

  ngOnInit() {
    // Inicializamos el formulario en ngOnInit
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Validación de email
      password: ['', [Validators.required]]  // Validación de contraseña
    });
  }

  // Método para manejar el login
  async login() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);  // Llamamos al método de login en el servicio
      this.router.navigate(['/home']);  // Redirigir a home después del login exitoso
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Aquí puedes mostrar un toast o alert
    } finally {
      this.isLoading = false;
    }
  }
}
