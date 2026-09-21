import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuesService } from '../../core/services/issues.service.js';
import { Building } from '@dormflow/shared-types';

@Component({
  selector: 'app-buildings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div style="margin-bottom: 24px;">
        <h1 style="margin: 0 0 6px 0; color: #003a61; font-size: 1.75rem;">Aachen Residence Complexes</h1>
        <p style="margin: 0; color: #64748b; font-size: 0.9375rem;">
          Managed dormitory buildings and facility locations in Aachen
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
        <div class="card" *ngFor="let b of buildings">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <span style="font-size: 1.5rem;">🏢</span>
            <div>
              <h3 style="margin: 0; font-size: 1.125rem; color: #003a61;">{{ b.name }}</h3>
              <span style="font-size: 0.8125rem; color: #64748b;">ID: {{ b.id }}</span>
            </div>
          </div>
          <div style="font-size: 0.875rem; color: #475569; margin-bottom: 16px;">
            📍 {{ b.address }}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; color: #64748b; padding-top: 12px; border-top: 1px solid #f1f5f9;">
            <span>RWTH Aachen Partner</span>
            <span style="color: #10b981; font-weight: 600;">Active Facility</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class BuildingsComponent implements OnInit {
  buildings: Building[] = [];

  constructor(private issuesService: IssuesService) {}

  ngOnInit(): void {
    this.issuesService.getBuildings().subscribe(b => (this.buildings = b));
  }
}
