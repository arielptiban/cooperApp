import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { IonContent, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton],
  encapsulation: ViewEncapsulation.None
})
export class ResultsPage implements OnInit {
  calculationResultHtml: any;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params["resultHtml"]) {
        const rawHtml = params["resultHtml"];
        this.calculationResultHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
      }
    });
  }

}
