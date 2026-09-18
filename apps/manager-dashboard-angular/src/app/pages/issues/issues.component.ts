import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssuesService } from '../../core/services/issues.service.js';
import { Issue, Building, IssueCategory, IssueUrgency, IssueStatus } from '@dormflow/shared-types';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 style="margin: 0 0 6px 0; color: #003a61; font-size: 1.75rem;">Maintenance Reports Management</h1>
          <p style="margin: 0; color: #64748b; font-size: 0.9375rem;">
            Triage, assign, and update student maintenance requests across Aachen residence halls
          </p>
        </div>
      </div>

      <!-- Filters Panel -->
      <div class="card" style="padding: 16px; margin-bottom: 20px;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; align-items: flex-end;">
          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">SEARCH</label>
            <input
              type="text"
              [(ngModel)]="filterSearch"
              (keyup.enter)="loadIssues()"
              placeholder="Title, room, keyword..."
              style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
            />
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">BUILDING</label>
            <select
              [(ngModel)]="filterBuilding"
              (change)="loadIssues()"
              style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
            >
              <option value="">All Buildings</option>
              <option *ngFor="let b of buildings" [value]="b.id">{{ b.name }}</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">CATEGORY</label>
            <select
              [(ngModel)]="filterCategory"
              (change)="loadIssues()"
              style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
            >
              <option value="">All Categories</option>
              <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">URGENCY</label>
            <select
              [(ngModel)]="filterUrgency"
              (change)="loadIssues()"
              style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
            >
              <option value="">All Urgencies</option>
              <option *ngFor="let u of urgencies" [value]="u">{{ u }}</option>
            </select>
          </div>

          <div>
            <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">STATUS</label>
            <select
              [(ngModel)]="filterStatus"
              (change)="loadIssues()"
              style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
            >
              <option value="">All Statuses</option>
              <option *ngFor="let s of statuses" [value]="s">{{ s.replace('_', ' ') }}</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              (click)="clearFilters()"
              style="padding: 8px 16px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; cursor: pointer; width: 100%; font-weight: 500;"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Issues Data Table -->
      <div class="card" style="padding: 0; overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Issue Title</th>
              <th>Building & Room</th>
              <th>Category</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Assignee</th>
              <th>Reported</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="loading">
              <td colspan="9" style="text-align: center; padding: 32px; color: #64748b;">
                Loading maintenance requests...
              </td>
            </tr>
            <tr *ngIf="!loading && issues.length === 0">
              <td colspan="9" style="text-align: center; padding: 32px; color: #64748b;">
                No issues match the selected filters.
              </td>
            </tr>
            <tr *ngFor="let issue of issues">
              <td style="font-family: monospace; font-size: 0.8125rem; font-weight: 600;">
                #{{ issue.id }}
              </td>
              <td>
                <div style="font-weight: 600; color: #0f172a;">{{ issue.title }}</div>
                <div style="font-size: 0.75rem; color: #64748b;">By {{ issue.createdByUser?.displayName || 'Resident' }}</div>
              </td>
              <td>
                <div>{{ issue.building?.name || 'Aachen' }}</div>
                <div style="font-size: 0.75rem; color: #64748b;">{{ issue.roomNumber ? 'Room ' + issue.roomNumber : 'Shared Facility' }}</div>
              </td>
              <td>{{ issue.category }}</td>
              <td>
                <span class="badge" [ngClass]="'urgency-' + issue.urgency">{{ issue.urgency }}</span>
              </td>
              <td>
                <span class="badge" [ngClass]="'status-' + issue.status">{{ issue.status.replace('_', ' ') }}</span>
              </td>
              <td>
                <span *ngIf="issue.assignedToUser" style="font-weight: 500; font-size: 0.8125rem; color: #005691;">
                  {{ issue.assignedToUser.displayName }}
                </span>
                <span *ngIf="!issue.assignedToUser" style="color: #94a3b8; font-style: italic; font-size: 0.8125rem;">
                  Unassigned
                </span>
              </td>
              <td style="font-size: 0.75rem; color: #64748b;">
                {{ issue.createdAt | date:'shortDate' }}
              </td>
              <td>
                <a
                  [routerLink]="['/admin/issues', issue.id]"
                  style="display: inline-block; padding: 6px 12px; background: #eaf3f9; color: #005691; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 0.8125rem;"
                >
                  Manage →
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class IssuesComponent implements OnInit {
  issues: Issue[] = [];
  buildings: Building[] = [];
  categories = Object.values(IssueCategory);
  urgencies = Object.values(IssueUrgency);
  statuses = Object.values(IssueStatus);

  filterSearch = '';
  filterBuilding = '';
  filterCategory = '';
  filterUrgency = '';
  filterStatus = '';
  loading = true;

  constructor(private issuesService: IssuesService) {}

  ngOnInit(): void {
    this.issuesService.getBuildings().subscribe(b => (this.buildings = b));
    this.loadIssues();
  }

  loadIssues(): void {
    this.loading = true;
    this.issuesService
      .getIssues({
        search: this.filterSearch || undefined,
        buildingId: this.filterBuilding || undefined,
        category: this.filterCategory || undefined,
        urgency: this.filterUrgency || undefined,
        status: this.filterStatus || undefined,
      })
      .subscribe({
        next: res => {
          this.issues = res.data;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  clearFilters(): void {
    this.filterSearch = '';
    this.filterBuilding = '';
    this.filterCategory = '';
    this.filterUrgency = '';
    this.filterStatus = '';
    this.loadIssues();
  }
}
