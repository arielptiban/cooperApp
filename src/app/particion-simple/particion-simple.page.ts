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

  onSubmit() {
    const emptyFields = this.fields.filter(field => !field.value);

    if (emptyFields.length > 0) {
      this.createToast("Complete todos los campos");
    }
    else {
      const [pv, t, n, O, E, c] = this.fields.map(field => field.value);

      if ([pv, t, n, O, E, c].every(value => value !== null)) {

        let mResult = this.mCalculate(pv!, t!)
        let bResult = this.bCalculate(t!, O!, E!)
        let coincidenceFrequency = this.coincidenceFreq(c!, mResult, bResult);
        let densityFrequency = this.densityFreq(E!, pv!, mResult, bResult);
        let zone1 = this.zone1Calc(mResult)
        let zone2 = this.zone2Calc(mResult, coincidenceFrequency, n!)
        this.presentResults(mResult, bResult, coincidenceFrequency, densityFrequency, zone1, zone2)
      }
      else {
        this.createToast("Ha ocurrido un error, revise los valores de las frecuencias");
      }
    }
  }

  async createToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
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
    const f: number[] = [125, 250, 500, 1000];
    const results = f.map(value => (20 * Math.log10(mResult * value)) - 47);

    return results;
  }

  zone2Calc(mResult: number, coincidenceFrequency: number, n: number): number[] {
    const f: number[] = [2000, 4000];

    let term1 = f.map(value => (20 * Math.log10(mResult * value)));
    let term2 = f.map(value => (10 * Math.log10((value / coincidenceFrequency) - 1)));
    let term3 = 10 * Math.log10(n)

    const R = term1.map((value, index) => value + term2[index] + term3 - 46);

    return R;
  }

  presentResults(mResult: number, bResult: number, coincidenceFrequency: number, densityFrequency: number, zone1: number[], zone2: number[]) {
    if (!Array.isArray(zone1)) {
      console.error("zone1 no es un array de números");
      return;
    }

    const f: string[] = ['125', '250', '500', '1k'];

    const calculationResult = `
    <h1 class="title">RESULTADOS</h1>
    <p class="description">Se han obtenido los siguientes resultados:</p>

    <p class="description">m = <strong>${mResult} kg/m2</strong></p>
    <p class="description">B = <strong>${bResult.toExponential(2)} Nm</strong></p>
    <h1 class="title">Frecuencias</h1>
    <p class="description">fc = <strong>${coincidenceFrequency.toFixed(2)} Hz</strong></p>
    <p class="description">fd = <strong>${densityFrequency.toFixed(2)} KHz</strong></p>
    <h1 class="title">Zone 1</h1>
    <!-- Mostrar todos los valores de zone1 -->
    ${zone1.map((value: number, index: number) => `
      <p class="description">R${f[index]}= <strong>${value.toFixed(2)} dB</strong></p>
    `).join('')}

    <h1 class="title">Zone 2</h1>
    <!-- Mostrar todos los valores de zone2 -->
    ${zone2.map((value: number, index: number) => `
      <p class="description">R${f[index]}= <strong>${value.toFixed(2)} dB</strong></p>
    `).join('')}
    <ion-button expand="block" shape="round" class="calculate-button" onclick="window.angularComponentRef.navigateTo('/particion-simple')">
      Volver
    </ion-button>
  `;

    this.router.navigate(['/results'], {
      queryParams: { resultHtml: calculationResult },
    });
  }

}
