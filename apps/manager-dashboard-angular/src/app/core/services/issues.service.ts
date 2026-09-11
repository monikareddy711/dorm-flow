import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Issue,
  DashboardSummary,
  Building,
  IssueStatusHistory,
  Comment,
  IssueStatus,
  CommentVisibility,
} from '@dormflow/shared-types';

@Injectable({
  providedIn: 'root',
})
export class IssuesService {
  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>('/api/dashboard/summary');
  }

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>('/api/buildings');
  }

  getIssues(filter?: {
    buildingId?: string;
    category?: string;
    urgency?: string;
    status?: string;
    search?: string;
  }): Observable<{ data: Issue[]; total: number }> {
    let params = new HttpParams();
    if (filter) {
      if (filter.buildingId) params = params.set('buildingId', filter.buildingId);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.urgency) params = params.set('urgency', filter.urgency);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.search) params = params.set('search', filter.search);
    }
    return this.http.get<{ data: Issue[]; total: number }>('/api/issues', { params });
  }

  getIssue(id: string): Observable<Issue> {
    return this.http.get<Issue>(`/api/issues/${id}`);
  }

  updateStatus(id: string, status: IssueStatus, note?: string): Observable<Issue> {
    return this.http.patch<Issue>(`/api/issues/${id}/status`, { status, note });
  }

  updateAssignment(id: string, assignedToUserId: string | null, note?: string): Observable<Issue> {
    return this.http.patch<Issue>(`/api/issues/${id}/assignment`, { assignedToUserId, note });
  }

  getHistory(id: string): Observable<IssueStatusHistory[]> {
    return this.http.get<IssueStatusHistory[]>(`/api/issues/${id}/history`);
  }

  getComments(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/issues/${id}/comments`);
  }

  addComment(id: string, content: string, visibility: CommentVisibility): Observable<Comment> {
    return this.http.post<Comment>(`/api/issues/${id}/comments`, { content, visibility });
  }
}
