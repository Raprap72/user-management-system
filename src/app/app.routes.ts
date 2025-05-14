import { Routes } from '@angular/router';

export const routes: Routes = [
  // Define your routes here
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
];