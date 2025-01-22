import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonToast
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-particion-simple',
  templateUrl: './particion-simple.page.html',
  styleUrls: ['./particion-simple.page.scss'],
  standalone: true,
  imports: [
    IonToast,
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,]
})

export class ParticionSimplePage implements OnInit {
  fields = [
    { name: 'Densidad (kg/m)', placeholder: 'pv', value: null },
    { name: 'Espesor (m)', placeholder: 't', value: null },
    { name: 'Factor de Amortiguamiento', placeholder: 'η', value: null },
    { name: 'Coeficiente de Poisson', placeholder: 'σ', value: null },
    { name: 'Módulo de Young', placeholder: 'E', value: null },
    { name: 'Velocidad del Sonido', placeholder: 'c', value: null },
  ];

  constructor(
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async onSubmit() {
    const emptyFields = this.fields.filter(field =>
      (field.value === null || field.value === undefined || field.value === '') &&
      !(field.name === 'Factor de Amortiguamiento' && field.value === 0) // Permitir que "Factor de Amortiguamiento" sea 0
    );

    if (emptyFields.length > 0) {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos.',
        duration: 3000,
        position: 'top',
      });
      toast.present();
    } else {
      const [pv, t, n, O, E, c] = this.fields.map(field => field.value);

      if (pv !== null && t !== null && n !== null && O !== null && E !== null && c !== null) {
        // Cálculo de m
        const m = pv * t;
        console.log(m);

        // Cálculo de B
        const B = (E / (1 - Math.pow(O, 2))) * (Math.pow(t, 3) / 12);

        console.log(E);
        console.log(`${B.toExponential(2)}`);

        // Resultados en HTML
        const calculationResult = `
          <h1 class="title">Resultados</h1>
          <p class="description">Se han obtenido los siguientes resultados:</p>
          <p class="description">m = <strong>${m} kg/m2</strong></p>
          <p class="description">B = <strong>${B.toExponential(2)} Nm</strong></p>
          <ion-button expand="block" shape="round" class="calculate-button" type="submit">
            Volver
          </ion-button>
        `;

        // Navegación a la página de resultados
        this.router.navigate(['/results'], {
          queryParams: { resultHtml: calculationResult },
        });
      } else {
        const toast = await this.toastController.create({
          message: 'Ha ocurrido un error, revise los valores de las frecuencias',
          duration: 3000,
          position: 'top',
        });
        toast.present();
      }
    }
  }

}
