export interface IssuePayload {
  id: string;
  title: string;
  status: string;
  urgency: string;
  category: string;
  updatedAt: string;
  building?: { name: string };
  roomNumber?: string;
}

export class DormflowIssueStatus extends HTMLElement {
  static get observedAttributes() {
    return ['issue-id', 'api-base-url'];
  }

  private _root: ShadowRoot;
  private _issueData: IssuePayload | null = null;
  private _loading: boolean = false;
  private _error: string | null = null;

  constructor() {
    super();
    this._root = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    if (this.getAttribute('issue-id')) {
      this.fetchIssue();
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue !== newValue) {
      if (name === 'issue-id' && newValue) {
        this.fetchIssue();
      }
    }
  }

  public get issueId(): string | null {
    return this.getAttribute('issue-id');
  }

  public set issueId(val: string | null) {
    if (val) {
      this.setAttribute('issue-id', val);
    } else {
      this.removeAttribute('issue-id');
    }
  }

  public get apiBaseUrl(): string {
    return this.getAttribute('api-base-url') || 'http://localhost:4000';
  }

  public set apiBaseUrl(val: string) {
    this.setAttribute('api-base-url', val);
  }

  public async fetchIssue() {
    const id = this.issueId;
    if (!id) return;

    this._loading = true;
    this._error = null;
    this.render();

    try {
      const response = await fetch(`${this.apiBaseUrl}/api/issues/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to load issue (${response.status})`);
      }
      this._issueData = await response.json();
    } catch (err: any) {
      this._error = err.message || 'Unable to connect to DormFlow API';
      this._issueData = null;
    } finally {
      this._loading = false;
      this.render();
    }
  }

  private handleOpenDetails = () => {
    if (!this._issueData) return;
    const event = new CustomEvent('dormflow-open-issue', {
      bubbles: true,
      composed: true,
      detail: {
        issueId: this._issueData.id,
        status: this._issueData.status,
        title: this._issueData.title,
      },
    });
    this.dispatchEvent(event);
  };

  private getStatusColor(status: string): string {
    switch (status) {
      case 'SUBMITTED': return '#6b7280';
      case 'REVIEWED': return '#3b82f6';
      case 'ASSIGNED': return '#8b5cf6';
      case 'IN_PROGRESS': return '#f59e0b';
      case 'RESOLVED': return '#10b981';
      case 'CLOSED': return '#4b5563';
      case 'REJECTED': return '#ef4444';
      default: return '#6b7280';
    }
  }

  private getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case 'EMERGENCY': return '#dc2626';
      case 'HIGH': return '#f97316';
      case 'MEDIUM': return '#3b82f6';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  }

  private render() {
    const styles = `
      :host {
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
        box-sizing: border-box;
      }
      *, *::before, *::after {
        box-sizing: inherit;
      }
      .card {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.2s ease, border-color 0.2s ease;
      }
      .card:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 12px;
        margin-bottom: 8px;
      }
      .title {
        font-size: 15px;
        font-weight: 600;
        color: #0f172a;
        margin: 0;
        line-height: 1.4;
      }
      .badges {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 12px;
      }
      .badge {
        font-size: 11px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 9999px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
      .meta {
        font-size: 12px;
        color: #64748b;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
      }
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 8px 12px;
        font-size: 13px;
        font-weight: 500;
        color: #005691;
        background-color: #eaf3f9;
        border: 1px solid transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.15s ease;
      }
      .btn:hover {
        background-color: #d2e7f6;
      }
      .btn:focus-visible {
        outline: 2px solid #005691;
        outline-offset: 2px;
      }
      .loading {
        color: #64748b;
        font-size: 13px;
        text-align: center;
        padding: 16px 0;
      }
      .error {
        color: #ef4444;
        font-size: 13px;
        background: #fef2f2;
        padding: 10px;
        border-radius: 6px;
      }
    `;

    if (this._loading) {
      this._root.innerHTML = `
        <style>${styles}</style>
        <div class="card" aria-busy="true" aria-live="polite">
          <div class="loading">Loading issue ${this.issueId || ''}...</div>
        </div>
      `;
      return;
    }

    if (this._error) {
      this._root.innerHTML = `
        <style>${styles}</style>
        <div class="card" role="alert">
          <div class="error">
            <strong>DormFlow Widget Error:</strong> ${this._error}
          </div>
        </div>
      `;
      return;
    }

    if (!this._issueData) {
      this._root.innerHTML = `
        <style>${styles}</style>
        <div class="card">
          <div class="loading">No issue specified. Provide an <code>issue-id</code> attribute.</div>
        </div>
      `;
      return;
    }

    const { id, title, status, urgency, updatedAt, building, roomNumber } = this._issueData;
    const formattedDate = new Date(updatedAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const locationText = [building?.name, roomNumber ? `Room ${roomNumber}` : null]
      .filter(Boolean)
      .join(' • ');

    this._root.innerHTML = `
      <style>${styles}</style>
      <div class="card" role="region" aria-label="Issue status card for ${title}">
        <div class="header">
          <h4 class="title">${title}</h4>
        </div>
        <div class="badges">
          <span class="badge" style="background: ${this.getStatusColor(status)}20; color: ${this.getStatusColor(status)};">
            ${status.replace('_', ' ')}
          </span>
          <span class="badge" style="background: ${this.getUrgencyColor(urgency)}20; color: ${this.getUrgencyColor(urgency)};">
            ${urgency}
          </span>
        </div>
        <div class="meta">
          <span>${locationText || 'Aachen Dorm'}</span>
          <span>Updated: ${formattedDate}</span>
        </div>
        <button type="button" class="btn" id="open-btn" aria-label="Open issue ${id}">
          View Full Details →
        </button>
      </div>
    `;

    this._root.querySelector('#open-btn')?.addEventListener('click', this.handleOpenDetails);
  }
}

if (typeof window !== 'undefined' && !customElements.get('dormflow-issue-status')) {
  customElements.define('dormflow-issue-status', DormflowIssueStatus);
}
