import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/appointments', pathMatch: 'full' },
  { 
    path: 'appointments', 
    loadComponent: () => import('./components/appointment-list/appointment-list.component').then(m => m.AppointmentListComponent)
  },
  { 
    path: 'appointments/new', 
    loadComponent: () => import('./components/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  },
  { 
    path: 'appointments/edit/:id', 
    loadComponent: () => import('./components/appointment-form/appointment-form.component').then(m => m.AppointmentFormComponent)
  }
];
