import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then(h => h.HomePage)
  },
  {
    path: 'particion-simple',
    loadComponent: () => import('./particion-simple/particion-simple.page').then( m => m.ParticionSimplePage)
  },
  {
    path: 'results',
    loadComponent: () => import('./results/results.page').then( m => m.ResultsPage)
  }
];
