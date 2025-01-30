import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonToast } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-particion-doble',
  templateUrl: './particion-doble.page.html',
  styleUrls: ['./particion-doble.page.scss'],
  standalone: true,
  imports: [IonToast,
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,]
})
export class ParticionDoblePage implements OnInit {

  fields = [
    { name: 'Masa del Ladrillo (kg/m2)', placeholder: 'm1', value: null },
    { name: 'Masa del Gypsum (kg/m2)', placeholder: 'm2', value: null },
    { name: 'Velocidad del Sonido', placeholder: 'c', value: null },
    { name: 'Distancia entre Particiones', placeholder: 'L', value: null },

  ];
  scientificNotationPattern = /^[+-]?\d*\.?\d+(e[+-]?\d+)?$/i;
  isCalculating: boolean = false;

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onSubmit() {

    this.isCalculating = true;

    setTimeout(() => {
      this.isCalculating = false;
      const emptyFields = this.fields.filter(field => !field.value);

      if (emptyFields.length > 0) {
        this.createToast('Por favor, complete todos los campos.');
        return;
      }

      // Validar cada campo si contiene un número en notación científica
      for (let i = 0; i < this.fields.length; i++) {
        const fieldValue = this.fields[i].value;
        if (fieldValue && !this.scientificNotationPattern.test(fieldValue)) {
          this.createToast(`El valor de ${this.fields[i].name} no es válido. Ingrese un número valido o en notación científica.`);
          return;
        }
      }

      // Si todos los campos son válidos, proceder con los cálculos
      const [m1, m2, c, L] = this.fields.map(field => Number(field.value));

      let meResult = this.meCalculate(m1, m2);
      let foResult = this.foCalculate(c, meResult, L)
      let flResult = this.flCalculate(c, L)
      this.presentResults(meResult, foResult, flResult);

    }, 2000);


  }

  async createToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  meCalculate(m1: number, m2: number) {
    const me = (2 * m1 * m2) / (m1 + m2)
    return me
  }

  foCalculate(c: number, me: number, L: number) {
    let fo = ((1.03 * c) / Math.PI) * Math.sqrt(1 / (L * me))
    return fo
  }

  flCalculate(c: number, L: number) {
    let fl = c / (2 * Math.PI * L)
    return fl
  }

  presentResults(meResult: number, foResult: number, flResult: number) {

    const calculationResult = `
    <div class="ticket">
    <h1 class="title">Resultados</h1>

    <div class="ticket-section">
      <p class="description">Masa (m): <strong> ${meResult.toFixed(2)} kg/m2</strong></p>
    </div>

    <div class="ticket-section">
      <p class="description">Frec. (fo): <strong> ${foResult.toFixed(2)} Hz</strong></p>
    </div>

    <div class="ticket-section">
      <p class="description">Frec. (fl): <strong> ${flResult.toFixed(2)} Hz</strong></p>
    </div>

    <ion-button expand="block" shape="round" class="calculate-button" onclick="window.angularComponentRef.navigateTo('/tabs/particion-doble')">
      Volver
    </ion-button>
  </div>

  `;

    this.router.navigate(['/results'], {
      queryParams: { resultHtml: calculationResult },
    });
  }
}
