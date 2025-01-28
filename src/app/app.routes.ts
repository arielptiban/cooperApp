import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.page').then((h) => h.HomePage), // Página inicial
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'particion-simple',
        loadComponent: () =>
          import('./particion-simple/particion-simple.page').then(
            (m) => m.ParticionSimplePage
          ),
      },
      {
        path: 'particion-doble',
        loadComponent: () =>
          import('./particion-doble/particion-doble.page').then(
            (m) => m.ParticionDoblePage
          ),
      },
      {
        path: '',
        redirectTo: '/tabs/particion-simple', // Ruta predeterminada de tabs
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'results',
    loadComponent: () => import('./results/results.page').then((m) => m.ResultsPage), // Página de resultados
  },
  {
    path: '**',
    redirectTo: '', // Redirige cualquier ruta desconocida a la página de inicio
  },
];
