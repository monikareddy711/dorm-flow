import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard.js';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard',
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/login/login.component.js').then(m => m.LoginComponent),
  },
  {
    path: 'admin/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component.js').then(m => m.DashboardComponent),
  },
  {
    path: 'admin/issues',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/issues/issues.component.js').then(m => m.IssuesComponent),
  },
  {
    path: 'admin/issues/:issueId',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/issue-detail/issue-detail.component.js').then(m => m.IssueDetailComponent),
  },
  {
    path: 'admin/buildings',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/buildings/buildings.component.js').then(m => m.BuildingsComponent),
  },
  {
    path: 'admin/web-component',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/web-component-demo/web-component-demo.component.js').then(
        m => m.WebComponentDemoComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard',
  },
];
