import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonButton,
  IonButtons,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-particion-simple',
  templateUrl: './particion-simple.page.html',
  styleUrls: ['./particion-simple.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    CommonModule,
    FormsModule,]
})
export class ParticionSimplePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
