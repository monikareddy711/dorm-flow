import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-layout" *ngIf="authService.currentUser$ | async as user; else publicLayout">
      <!-- Admin Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2>🏢 DormFlow Aachen</h2>
          <span class="subtitle">Facility Manager Console</span>
        </div>

        <ul class="nav-links">
          <li>
            <a routerLink="/admin/dashboard" routerLinkActive="active">
              📊 Overview & KPIs
            </a>
          </li>
          <li>
            <a routerLink="/admin/issues" routerLinkActive="active">
              📋 Maintenance Tickets
            </a>
          </li>
          <li>
            <a routerLink="/admin/buildings" routerLinkActive="active">
              🏢 Residence Halls
            </a>
          </li>
          <li>
            <a routerLink="/admin/web-component" routerLinkActive="active">
              🧩 Web Component Demo
            </a>
          </li>
        </ul>

        <div class="sidebar-footer">
          <div style="font-weight: 600; color: #ffffff; margin-bottom: 2px;">{{ user.displayName }}</div>
          <div style="color: #94a3b8; font-size: 0.75rem; margin-bottom: 12px;">{{ user.role }} • {{ user.email }}</div>
          <button
            type="button"
            (click)="logout()"
            style="width: 100%; padding: 8px; background: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 4px; font-size: 0.8125rem; cursor: pointer;"
          >
            Sign Out
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>

    <ng-template #publicLayout>
      <router-outlet></router-outlet>
    </ng-template>
  `,
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }
}
