import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IonContent, IonButton } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent]
})
export class HomePage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.navCtrl.navigateForward('/particion-simple');
    }, 3000);
  }

}
