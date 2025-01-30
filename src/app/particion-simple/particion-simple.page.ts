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
    FormsModule,
  ]
})

export class ParticionSimplePage implements OnInit {
  fields = [
    { name: 'Densidad (kg/m)', placeholder: 'pv', value: null },
    { name: 'Espesor (m)', placeholder: 't', value: null },
    { name: 'Factor de Amortiguamiento', placeholder: 'η', value: null },
    { name: 'Coeficiente de Poisson', placeholder: 'σ', value: null },
    { name: 'Módulo de Young', placeholder: 'E', value: null },
    { name: 'Velocidad del Sonido', placeholder: 'c', value: null },
    { name: 'Frecuencia', placeholder: 'f', value: null },

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
      const [pv, t, n, O, E, c, f] = this.fields.map(field => field.value);

      if (f! <= 100) {
        let mResult = this.mCalculate(pv!, t!);
        let bResult = this.bCalculate(t!, O!, E!);
        let coincidenceFrequency = this.coincidenceFreq(c!, mResult, bResult);
        let densityFrequency = this.densityFreq(E!, pv!, mResult, bResult);
        let zone1 = this.zone1Calc(mResult);
        let zone2 = this.zone2Calc(mResult, coincidenceFrequency, n!);
        let zone3 = this.zone3Calc(mResult, f!);
        this.presentResults(mResult, bResult, coincidenceFrequency, densityFrequency, zone1, zone2, zone3);
      } else {
        this.createToast('Frecuencia no debe ser mayor a 100');
      }
    }, 2000);
    // Verificar si algún campo tiene un valor vacío o nulo

  }

  async createToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
    });

    toast.present();
  }

  mCalculate(pv: number, t: number) {
    const m = pv * t;
    return m
  }

  bCalculate(t: number, O: number, E: number) {
    const B = (E / (1 - Math.pow(O, 2))) * (Math.pow(t, 3) / 12);
    return B
  }

  coincidenceFreq(c: number, mResult: number, bResult: number) {
    let fc = ((Math.pow(c, 2) / (2 * Math.PI)) * Math.sqrt((mResult / bResult)))
    return fc
  }

  densityFreq(E: number, pv: number, mResult: number, bResult: number) {
    let fd = (E / ((2 * Math.PI) * pv) * Math.sqrt((mResult / bResult)))
    let fdResult = fd.toFixed(2)
    let KHZ = parseFloat(fdResult) / 1000
    return KHZ
  }

  zone1Calc(mResult: number): number[] {
    const f: number[] = [125, 250, 500, 1000, 2000, 4000];
    const results = f.map(value => (20 * Math.log10(mResult * value)) - 47);

    return results;
  }

  zone2Calc(mResult: number, coincidenceFrequency: number, n: number): number[] {
    const f: number[] = [125, 250, 500, 1000, 2000, 4000];

    let term1 = f.map(value => (20 * Math.log10(mResult * value)));
    let term2 = f.map(value => (10 * Math.log10((value / coincidenceFrequency) - 1)));
    let term3 = 10 * Math.log10(n)

    const R = term1.map((value, index) => value + term2[index] + term3 - 46);

    return R;
  }

  zone3Calc(mResult: number, f: number) {
    let R = 20 * Math.log10((mResult * f)) - 47
    return R
  }

  presentResults(mResult: number, bResult: number, coincidenceFrequency: number, densityFrequency: number, zone1: number[], zone2: number[], zone3: number) {
    if (!Array.isArray(zone1)) {
      console.error("zone1 no es un array de números");
      return;
    }

    const f1: string[] = ['125', '250', '500', '1k', '2k', '4k'];
    const f2: string[] = ['125', '250', '500', '1k', '2k', '4k'];

    const calculationResult = `
    <div class="ticket">
    <h1 class="title">Resultados</h1>

    <div class="ticket-section">
      <p class="description">Masa (m): <strong> ${mResult} kg/m2</strong></p>
      <p class="description">Rigidez (B): <strong> ${bResult.toFixed(2)} Nm</strong></p>
    </div>

    <div class="ticket-section">
      <h2 class="subtitle">Frecuencias</h2>
      <p class="description">Frec. de coincidencia (fc):<strong> ${coincidenceFrequency.toFixed(2)} Hz</strong></p>
      <p class="description">Frec. de densidad (fd):<strong> ${densityFrequency.toFixed(2)} KHz</strong></p>
    </div>

    <div class="ticket-section">
      <h2 class="subtitle">Zona 1</h2>
      ${zone1.map(
      (value: number, index: number) => `
          <p class="description">R${f1[index]}: <strong>${value.toFixed(2)} dB</strong></p>
        `
    ).join('')}
    </div>

    <div class="ticket-section">
      <h2 class="subtitle">Zona 2</h2>
      ${zone2.map(
      (value: number, index: number) => `
          <p class="description">R${f2[index]}: <strong>${value.toFixed(2)} dB</strong></p>
        `
    ).join('')}
    </div>

    <div class="ticket-section">
      <h2 class="subtitle">Zona 3</h2>
      <p class="description">fd = <strong>${zone3.toFixed(2)} dB</strong></p>
    </div>

    <ion-button expand="block" shape="round" class="calculate-button" onclick="window.angularComponentRef.navigateTo('/tabs/particion-simple')">
      Volver
    </ion-button>
  </div>

  `;

    this.router.navigate(['/results'], {
      queryParams: { resultHtml: calculationResult },
    });
  }

}
