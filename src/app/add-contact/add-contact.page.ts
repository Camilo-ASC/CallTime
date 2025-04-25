import { Component, OnDestroy } from "@angular/core";
import { ModalController, AlertController } from "@ionic/angular";
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment';
import { NgForm } from "@angular/forms";
import { getAuth } from "firebase/auth";
import { Subject } from "rxjs";
import { getDoc } from "firebase/firestore";

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.page.html',
  styleUrls: ['./add-contact.page.scss'],
  standalone: false
})
export class AddContactPage implements OnDestroy {
  name!: string;
  lastname!: string;
  phone!: string;

  private app = initializeApp(environment.firebaseConfig);
  private db = getFirestore(this.app);
  private auth = getAuth(); // Obtener la autenticación de Firebase
  private destroy$ = new Subject<void>();

  constructor(
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  closeModal() {
    this.modalController.dismiss();
  }

  async addContact(form: NgForm) {
    if (!form.valid || !this.name.trim() || !this.lastname.trim() || !this.phone.trim()) {
      await this.showErrorMessage("Por favor, complete todos los campos correctamente.");
      return;
    }

    try {
      // Verificar si el usuario está autenticado
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        console.error("Usuario no autenticado.");
        await this.showErrorMessage("Debe estar autenticado para agregar contactos.");
        return;
      }

      const userUID = currentUser.uid;
      console.log("🔥 UID autenticado:", userUID);
      console.log("📄 Intentando guardar en ruta:", `users/${userUID}/contacts/${this.phone}`);




      console.log("Buscando usuario con el número:", this.phone);
      const usersCollectionRef = collection(this.db, "users");
      const phoneQuery = query(usersCollectionRef, where("phone", "==", this.phone));
      const querySnapshot = await getDocs(phoneQuery);
      console.log("Resultados de la consulta:", querySnapshot);
      if (querySnapshot.empty) {
          console.error("No se encontró usuario con ese número.");
          await this.showErrorMessage("No se encontró usuario con ese número. No se puede agregar el contacto.");
          return;
      }

      console.log("Usuario con el número encontrado. Agregando a contactos...");

      // Guardar el contacto en la subcolección del usuario autenticado
      const contactData = {
        name: this.name.trim(),
        lastname: this.lastname.trim(),
        phone: this.phone.trim()
      };
      
      // 0. Confirmar que el documento del usuario autenticado existe (esperar hasta que se confirme)
const userDocPath = `users/${userUID}`;
const userDoc = doc(this.db, userDocPath);
const existingUserSnap = await getDoc(userDoc);

if (!existingUserSnap.exists()) {
  console.log("📄 El documento del usuario no existe. Creándolo primero.");
  await setDoc(userDoc, {}, { merge: true });
} else {
  console.log("✅ El documento del usuario ya existe.");
}
      // 1. Guardar en Firestore
      const userDocRef = doc(this.db, `users/${userUID}/contacts/${this.phone}`);
      console.log("🧠 Comparando UID:", this.auth.currentUser?.uid, "con", userUID);
      await setDoc(userDocRef, contactData, { merge: true });
      console.log("✅ Contacto guardado correctamente en Firestore.");
      
      // 2. Guardar en LocalStorage
      const storedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      storedContacts.push({ id: this.phone, ...contactData });
      localStorage.setItem('contacts', JSON.stringify(storedContacts));

      console.log("Contacto guardado bajo el usuario autenticado.");
      await this.showSuccessMessage("Contacto guardado exitosamente.");
      this.modalController.dismiss({ success: true, contact: contactData });

      this.clearForm(form);
    } catch (error: any) {
      console.error("Error al agregar contacto:", error);
      const errorMessage = error?.message || "Error desconocido";
      await this.showErrorMessage(`Error: ${errorMessage}`);
    }
  }

  async showSuccessMessage(message: string) {
    const alert = await this.alertController.create({
      header: "¡Éxito!",
      message: message,
      buttons: ["Aceptar"]
    });
    await alert.present();
  }

  async showErrorMessage(message: string) {
    const alert = await this.alertController.create({
      header: "Error",
      message: message,
      buttons: ["Aceptar"]
    });
    await alert.present();
  }

  clearForm(form: NgForm) {
    form.resetForm();
    this.name = '';
    this.lastname = '';
    this.phone = '';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}