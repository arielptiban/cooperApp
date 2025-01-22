import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { IonContent, IonButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonContent],
  encapsulation: ViewEncapsulation.None
})
export class ResultsPage implements OnInit {
  calculationResultHtml: any;
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {
    (window as any).angularComponentRef = {
      navigateTo: this.navigateTo.bind(this),
    };
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params && params["resultHtml"]) {
        const rawHtml = params["resultHtml"];
        this.calculationResultHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
      }
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

}
