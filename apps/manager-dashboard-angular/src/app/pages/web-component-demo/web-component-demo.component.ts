import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import '@dormflow/web-components';

@Component({
  selector: 'app-web-component-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div>
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 6px 0; color: #003a61; font-size: 1.75rem;">Web Component in Angular Integration</h1>
        <p style="margin: 0; color: #64748b; font-size: 0.9375rem;">
          Demonstrating cross-framework reuse of &lt;dormflow-issue-status&gt; inside Angular standalone components
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 28px;">
        <div>
          <h3>Issue #101: Leaking Radiator</h3>
          <dormflow-issue-status
            issue-id="iss-101"
            api-base-url="http://localhost:4000"
            (dormflow-open-issue)="onOpenIssue($event)"
          ></dormflow-issue-status>
        </div>

        <div>
          <h3>Issue #104: Fiber Switch Disconnect</h3>
          <dormflow-issue-status
            issue-id="iss-104"
            api-base-url="http://localhost:4000"
            (dormflow-open-issue)="onOpenIssue($event)"
          ></dormflow-issue-status>
        </div>
      </div>

      <div class="card">
        <h3 style="margin: 0 0 12px 0; font-size: 1.0625rem; color: #003a61;">Angular Host Event Logs</h3>
        <p *ngIf="logs.length === 0" style="color: #64748b; font-size: 0.875rem; margin: 0;">
          Click "View Full Details →" on the custom elements above to observe Angular event handling.
        </p>
        <ul *ngIf="logs.length > 0" style="margin: 0; padding-left: 20px; font-family: monospace; font-size: 0.875rem; color: #005691;">
          <li *ngFor="let log of logs">{{ log }}</li>
        </ul>
      </div>
    </div>
  `,
})
export class WebComponentDemoComponent {
  logs: string[] = [];

  onOpenIssue(event: any) {
    const detail = event.detail;
    const time = new Date().toLocaleTimeString();
    this.logs.unshift(`[${time}] Angular caught 'dormflow-open-issue': ${detail.issueId} (${detail.title})`);
  }
}
