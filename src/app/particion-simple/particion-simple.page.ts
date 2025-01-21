import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonToast
} from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';

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
    { name: 'densidad', placeholder: 'Densidad Vol.', value: null },
    { name: 'espesor', placeholder: 'Espesor', value: null },
    { name: 'factAmortiguamiento', placeholder: 'Fact. amortiguamiento', value: null },
    { name: 'coefPoisson', placeholder: 'Coeficiente de Poisson', value: null },
    { name: 'modYoung', placeholder: 'Modulo de Young', value: null },
    { name: 'velocidadSonido', placeholder: 'Velocidad del sonido', value: null },
  ];

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  async onSubmit() {
    const emptyFields = this.fields.filter(field => !field.value);

    if (emptyFields.length > 0) {
      const toast = await this.toastController.create({
        message: 'Por favor, complete todos los campos.',
        duration: 3000,
        position: 'top',
      });
      toast.present();
    } else {

      let pv = this.fields[0].value
      let t = this.fields[1].value
      let n = this.fields[2].value
      let O = this.fields[3].value
      let E = this.fields[4].value
      let c = this.fields[5].value

      let m: number
      let B: number

      if (pv && t && n && O && E && c !== null) {
        //calculo de m
        m = pv * t
        console.log(m)

        //calculo de B
        B = (E / (1 - Math.pow(O, 2))) * ((Math.pow(t, 3)) / 12)

        console.log(E)
        console.log(`${B.toExponential(2)}`)

      }
      else {
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
