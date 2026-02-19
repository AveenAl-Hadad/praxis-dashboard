import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard-page/dashboard-page')
        .then(m => m.DashboardPage),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./features/patients/patients-page/patients-page')
        .then(m => m.PatientsPage),
  },
  {
    path: 'appointments',
    loadComponent: () =>
      import('./features/appointments/appointments-page/appointments-page')
        .then(m => m.AppointmentsPage),
  },

  { path: '**', redirectTo: 'dashboard' },
];