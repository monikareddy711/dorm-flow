import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IssuesService } from '../../core/services/issues.service.js';
import {
  Issue,
  IssueStatusHistory,
  Comment,
  IssueStatus,
  CommentVisibility,
} from '@dormflow/shared-types';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div *ngIf="issue">
      <div style="margin-bottom: 20px;">
        <a routerLink="/admin/issues" style="color: #005691; text-decoration: none; font-size: 0.875rem; font-weight: 500;">
          ← Back to Issues Overview
        </a>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        <div>
          <span style="font-size: 0.8125rem; font-weight: 600; color: #64748b;">TICKET #{{ issue.id }}</span>
          <h1 style="margin: 4px 0 8px 0; color: #003a61; font-size: 1.75rem;">{{ issue.title }}</h1>
          <div style="font-size: 0.875rem; color: #64748b;">
            Submitted by <strong>{{ issue.createdByUser?.displayName || 'Resident' }}</strong> ({{ issue.createdByUser?.email }})
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge" [ngClass]="'urgency-' + issue.urgency">{{ issue.urgency }}</span>
          <span class="badge" [ngClass]="'status-' + issue.status">{{ issue.status.replace('_', ' ') }}</span>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
        <!-- Left Column: Details & Discussion -->
        <div>
          <div class="card">
            <h3 style="margin: 0 0 12px 0; font-size: 1.125rem; color: #003a61;">Reported Description</h3>
            <p style="font-size: 0.9375rem; line-height: 1.6; color: #334155; white-space: pre-wrap; margin: 0 0 20px 0;">
              {{ issue.description }}
            </p>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 0.875rem;">
              <div><strong>Building:</strong> {{ issue.building?.name }}</div>
              <div><strong>Room / Location:</strong> {{ issue.roomNumber || 'Shared Space' }}</div>
              <div><strong>Category:</strong> {{ issue.category }}</div>
              <div><strong>Area Type:</strong> {{ issue.locationType }}</div>
              <div><strong>Reported At:</strong> {{ issue.createdAt | date:'medium' }}</div>
              <div><strong>Subscribers:</strong> {{ issue.followersCount || 0 }} resident(s)</div>
            </div>
          </div>

          <!-- Comments & Notes -->
          <div class="card">
            <h3 style="margin: 0 0 16px 0; font-size: 1.125rem; color: #003a61;">
              Communication & Work Notes ({{ comments.length }})
            </h3>

            <div style="margin-bottom: 20px;">
              <div *ngIf="comments.length === 0" style="color: #64748b; font-size: 0.875rem; font-style: italic;">
                No comments or internal notes recorded yet.
              </div>
              <div
                *ngFor="let c of comments"
                style="padding: 12px 16px; border-radius: 6px; margin-bottom: 12px;"
                [style.background]="c.visibility === 'INTERNAL' ? '#fef3c7' : '#f1f5f9'"
                [style.border]="c.visibility === 'INTERNAL' ? '1px dashed #f59e0b' : '1px solid #e2e8f0'"
              >
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 0.8125rem;">
                  <span style="font-weight: 600; color: #0f172a;">
                    {{ c.authorName }}
                    <span *ngIf="c.visibility === 'INTERNAL'" style="color: #b45309; font-size: 0.75rem; margin-left: 6px;">[INTERNAL STAFF NOTE]</span>
                  </span>
                  <span style="color: #64748b;">{{ c.createdAt | date:'shortTime' }}</span>
                </div>
                <div style="font-size: 0.875rem; color: #334155; line-height: 1.5;">{{ c.content }}</div>
              </div>
            </div>

            <!-- Add Comment Form -->
            <div>
              <textarea
                rows="3"
                [(ngModel)]="newCommentText"
                placeholder="Write a message to the resident or an internal note for technicians..."
                style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; margin-bottom: 10px;"
              ></textarea>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <label style="font-size: 0.8125rem; color: #475569; display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" [(ngModel)]="isInternalComment" />
                  Staff Internal Note (Hidden from resident)
                </label>
                <button
                  type="button"
                  (click)="submitComment()"
                  [disabled]="!newCommentText.trim()"
                  style="padding: 8px 16px; background: #005691; color: #fff; border: none; border-radius: 4px; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
                >
                  Post Message
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Manager Action Controls -->
        <div>
          <!-- Workflow Status Management Card -->
          <div class="card" style="border-top: 4px solid #005691;">
            <h3 style="margin: 0 0 16px 0; font-size: 1.0625rem; color: #003a61;">Lifecycle Status Action</h3>
            <div style="margin-bottom: 14px;">
              <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">CURRENT STATUS</label>
              <select
                [(ngModel)]="selectedStatus"
                style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem; font-weight: 600;"
              >
                <option *ngFor="let s of statuses" [value]="s">{{ s.replace('_', ' ') }}</option>
              </select>
            </div>

            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">STATUS TRANSITION NOTE</label>
              <input
                type="text"
                [(ngModel)]="statusNote"
                placeholder="Reason or work order reference..."
                style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.8125rem;"
              />
            </div>

            <button
              type="button"
              (click)="saveStatus()"
              style="width: 100%; padding: 10px; background: #005691; color: #fff; border: none; border-radius: 6px; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
            >
              Update Status
            </button>
          </div>

          <!-- Assignee Management Card -->
          <div class="card">
            <h3 style="margin: 0 0 16px 0; font-size: 1.0625rem; color: #003a61;">Work Assignment</h3>
            <div style="margin-bottom: 16px;">
              <label style="display: block; font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 4px;">RESPONSIBLE TECHNICIAN</label>
              <select
                [(ngModel)]="selectedAssigneeId"
                style="width: 100%; padding: 8px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.875rem;"
              >
                <option value="">Unassigned</option>
                <option value="usr-manager-daniel">Daniel Becker (Manager)</option>
                <option value="usr-tech-marcus">Marcus Weber (Sanitary & Heating)</option>
              </select>
            </div>

            <button
              type="button"
              (click)="saveAssignment()"
              style="width: 100%; padding: 10px; background: #f1f5f9; color: #003a61; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 600; font-size: 0.875rem; cursor: pointer;"
            >
              Update Assignee
            </button>
          </div>

          <!-- Audit History Timeline -->
          <div class="card">
            <h3 style="margin: 0 0 14px 0; font-size: 1.0625rem; color: #003a61;">Audit Timeline</h3>
            <div style="font-size: 0.8125rem;">
              <div *ngFor="let h of history" style="margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid #f1f5f9;">
                <div style="font-weight: 600; color: #0f172a;">
                  Status: <span class="badge" [ngClass]="'status-' + h.newStatus">{{ h.newStatus }}</span>
                </div>
                <div *ngIf="h.note" style="color: #475569; margin-top: 3px;">{{ h.note }}</div>
                <div style="color: #94a3b8; font-size: 0.75rem; margin-top: 2px;">
                  {{ h.changedByName }} • {{ h.createdAt | date:'short' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  history: IssueStatusHistory[] = [];
  comments: Comment[] = [];
  statuses = Object.values(IssueStatus);

  selectedStatus: IssueStatus = IssueStatus.SUBMITTED;
  statusNote = '';
  selectedAssigneeId = '';
  newCommentText = '';
  isInternalComment = false;

  constructor(
    private route: ActivatedRoute,
    private issuesService: IssuesService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('issueId');
    if (id) {
      this.loadIssue(id);
    }
  }

  loadIssue(id: string): void {
    this.issuesService.getIssue(id).subscribe(issue => {
      this.issue = issue;
      this.selectedStatus = issue.status;
      this.selectedAssigneeId = issue.assignedToUserId || '';
    });
    this.issuesService.getHistory(id).subscribe(h => (this.history = h));
    this.issuesService.getComments(id).subscribe(c => (this.comments = c));
  }

  saveStatus(): void {
    if (!this.issue) return;
    this.issuesService.updateStatus(this.issue.id, this.selectedStatus, this.statusNote).subscribe(updated => {
      this.issue = updated;
      this.statusNote = '';
      this.issuesService.getHistory(updated.id).subscribe(h => (this.history = h));
    });
  }

  saveAssignment(): void {
    if (!this.issue) return;
    this.issuesService.updateAssignment(this.issue.id, this.selectedAssigneeId || null).subscribe(updated => {
      this.issue = updated;
      this.issuesService.getHistory(updated.id).subscribe(h => (this.history = h));
    });
  }

  submitComment(): void {
    if (!this.issue || !this.newCommentText.trim()) return;
    const visibility = this.isInternalComment ? CommentVisibility.INTERNAL : CommentVisibility.PUBLIC;
    this.issuesService.addComment(this.issue.id, this.newCommentText.trim(), visibility).subscribe(c => {
      this.comments.push(c);
      this.newCommentText = '';
      this.isInternalComment = false;
    });
  }
}
