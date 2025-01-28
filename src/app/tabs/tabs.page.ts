import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonTabs, IonTabButton, IonTabBar, IonIcon, IonContent, IonTab, IonHeader, IonToolbar, IonTitle, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { library, playCircle, radio, search, personOutline, home, layers, copy, statsChart, square } from 'ionicons/icons';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabButton, IonTabs, CommonModule, FormsModule, IonTabs, IonIcon, IonLabel]
})
export class TabsPage implements OnInit {

  constructor() {
    addIcons({ square, copy });
  }

  ngOnInit() {
  }

}
