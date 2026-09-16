import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IssuesService } from '../../core/services/issues.service.js';
import { DashboardSummary } from '@dormflow/shared-types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0 0 6px 0; color: #003a61; font-size: 1.75rem;">Facility Operations Dashboard</h1>
          <p style="margin: 0; color: #64748b; font-size: 0.9375rem;">
            Real-time Aachen student residence maintenance performance & workload overview
          </p>
        </div>
        <a routerLink="/admin/issues" style="display: inline-block; padding: 10px 18px; background: #005691; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.875rem;">
          View All Tickets →
        </a>
      </div>

      <!-- KPI Stat Grid -->
      <div class="stat-grid" *ngIf="summary">
        <div class="stat-card" style="border-left: 4px solid #3b82f6;">
          <span class="stat-label">Active Open Issues</span>
          <span class="stat-value">{{ summary.openIssues }}</span>
        </div>

        <div class="stat-card" style="border-left: 4px solid #dc2626;">
          <span class="stat-label">Urgent / Emergencies</span>
          <span class="stat-value" style="color: #dc2626;">{{ summary.urgentIssues }}</span>
        </div>

        <div class="stat-card" style="border-left: 4px solid #10b981;">
          <span class="stat-label">Resolved This Week</span>
          <span class="stat-value" style="color: #10b981;">{{ summary.resolvedThisWeek }}</span>
        </div>

        <div class="stat-card" style="border-left: 4px solid #8b5cf6;">
          <span class="stat-label">Avg Resolution Time</span>
          <span class="stat-value" style="color: #8b5cf6;">{{ summary.averageResolutionHours }}h</span>
        </div>
      </div>

      <!-- Category & Status Breakdown -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px;" *ngIf="summary">
        <div class="card">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #003a61;">Issues by Status</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Lifecycle Status</th>
                <th style="text-align: right;">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of summary.byStatus | keyvalue">
                <td>
                  <span class="badge" [ngClass]="'status-' + item.key">{{ item.key }}</span>
                </td>
                <td style="text-align: right; font-weight: 600;">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card">
          <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #003a61;">Issues by Category</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Discipline / Category</th>
                <th style="text-align: right;">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of summary.byCategory | keyvalue">
                <td>{{ item.key }}</td>
                <td style="text-align: right; font-weight: 600;">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;

  constructor(private issuesService: IssuesService) {}

  ngOnInit(): void {
    this.issuesService.getDashboardSummary().subscribe({
      next: data => (this.summary = data),
      error: console.error,
    });
  }
}
