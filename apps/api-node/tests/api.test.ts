import test from 'node:test';
import assert from 'node:assert';
import { StoreService } from '../src/services/store.service.js';
import { IssueStatus, IssueCategory, IssueUrgency, LocationType, UserRole } from '@dormflow/shared-types';

test('StoreService initializes with seed data', () => {
  const store = StoreService.getInstance();
  assert.ok(store.buildings.length >= 4, 'Should have at least 4 Aachen dorms');
  assert.ok(store.users.length >= 4, 'Should have at least 4 default users');
  assert.ok(store.issues.length >= 5, 'Should have at least 5 default issues');
});

test('Manager can view dashboard summary metrics', () => {
  const store = StoreService.getInstance();
  const summary = store.getDashboardSummary();
  assert.ok(typeof summary.openIssues === 'number');
  assert.ok(typeof summary.urgentIssues === 'number');
  assert.ok(typeof summary.averageResolutionHours === 'number');
});

test('Status transition appends to history', () => {
  const store = StoreService.getInstance();
  const issue = store.issues[0];
  const originalStatus = issue.status;

  issue.status = IssueStatus.RESOLVED;
  store.history.unshift({
    id: 'test-hst-1',
    issueId: issue.id,
    previousStatus: originalStatus,
    newStatus: IssueStatus.RESOLVED,
    changedByUserId: 'usr-manager-daniel',
    changedByName: 'Daniel Becker',
    note: 'Tested valve replacement',
    createdAt: new Date().toISOString(),
  });

  const histories = store.history.filter(h => h.issueId === issue.id);
  assert.strictEqual(histories[0].newStatus, IssueStatus.RESOLVED);
});
