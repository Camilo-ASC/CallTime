import { Component } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { getAuth, createUserWithEmailAndPassword, User as FirebaseUser } from "firebase/auth";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app"; // <- aquí usas el SDK directo, no @angular/fire
import { environment } from "src/environments/environment";
import { User } from "src/app/core/interfaces/user";
import { getDoc } from "firebase/firestore";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm!: FormGroup;
  isLoading = false;

  // Firebase
  private app = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  constructor(
    private alertController: AlertController,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register(): Promise<void> {
    if (this.registerForm.invalid) {
      console.error("Formulario inválido");
      return;
    }

    this.isLoading = true;

    const { name, lastname, phone, email, password } = this.registerForm.value;

    const userData: User = {
      uid: "",
      name,
      lastname,
      phone,
      email
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const firebaseUser: FirebaseUser = userCredential.user;
      userData.uid = firebaseUser.uid;

      const userDocRef = doc(collection(this.db, "users"), firebaseUser.uid);
      await setDoc(userDocRef, userData);

      // Verificar si el documento del usuario existe
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    console.error("El documento del usuario no se creó correctamente.");
    return;
  }
  console.log("Documento del usuario creado correctamente.");
      await this.showSuccessMessage();

    } catch (error: any) {
      console.error("Error al registrar:", error.message);
    } finally {
      this.isLoading = false;
    }
  }

  async showSuccessMessage() {
    const alert = await this.alertController.create({
      header: "Registro Exitoso",
      message: "El usuario ha sido registrado correctamente.",
      buttons: [{
        text: "Aceptar",
        handler: () => {
          this.router.navigate(["/login"]);
        }
      }]
    });

    await alert.present();
  }
}
