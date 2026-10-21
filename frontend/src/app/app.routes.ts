import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bsc-completo',
    loadComponent: () => import('./features/bsc-complete/bsc-complete.component').then(m => m.BscCompleteComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mapa-estrategico',
    loadComponent: () => import('./features/strategy-map/strategy-map.component').then(m => m.StrategyMapComponent),
    canActivate: [authGuard]
  },
  {
    path: 'objetivos',
    loadComponent: () => import('./features/objectives/objectives.component').then(m => m.ObjectivesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mediciones',
    loadComponent: () => import('./features/measurements/measurements.component').then(m => m.MeasurementsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'iniciativas',
    loadComponent: () => import('./features/initiatives/initiatives.component').then(m => m.InitiativesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reportes',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'dashboard' }
];
