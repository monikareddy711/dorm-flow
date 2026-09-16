import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f1f5f9; padding: 20px;">
      <div class="card" style="max-width: 420px; width: 100%; border-top: 4px solid #005691;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="margin: 0 0 6px 0; color: #003a61;">Staff & Facility Portal</h2>
          <span style="font-size: 0.875rem; color: #64748b;">DormFlow Aachen Management</span>
        </div>

        <div *ngIf="errorMessage" style="background: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 10px; border-radius: 6px; margin-bottom: 16px; font-size: 0.875rem;">
          {{ errorMessage }}
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 6px; color: #334155;">Staff Email</label>
            <input
              type="email"
              formControlName="email"
              style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9375rem;"
              placeholder="name@dormflow.rwth.de"
            />
          </div>

          <div style="margin-bottom: 20px;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 6px; color: #334155;">Password</label>
            <input
              type="password"
              formControlName="password"
              style="width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9375rem;"
            />
          </div>

          <button
            type="submit"
            [disabled]="loading || loginForm.invalid"
            style="width: 100%; padding: 12px; background: #005691; color: #ffffff; border: none; border-radius: 6px; font-weight: 600; font-size: 0.9375rem; cursor: pointer;"
          >
            {{ loading ? 'Signing in...' : 'Sign In as Staff' }}
          </button>
        </form>

        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
          <div style="font-size: 0.8125rem; color: #64748b; margin-bottom: 8px; font-weight: 600;">
            Quick Staff Autofill:
          </div>
          <div style="display: flex; gap: 8px; flex-direction: column;">
            <button
              type="button"
              (click)="autofill('daniel@dormflow.rwth.de')"
              style="text-align: left; font-size: 0.8125rem; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; background: #f8fafc; cursor: pointer;"
            >
              🏢 Daniel Becker (Dormitory Manager)
            </button>
            <button
              type="button"
              (click)="autofill('marcus@dormflow.rwth.de')"
              style="text-align: left; font-size: 0.8125rem; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 4px; background: #f8fafc; cursor: pointer;"
            >
              🔧 Marcus Weber (Technician)
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['daniel@dormflow.rwth.de', [Validators.required, Validators.email]],
      password: ['Password123!', Validators.required],
    });
  }

  autofill(email: string) {
    this.loginForm.patchValue({ email, password: 'Password123!' });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: res => {
        this.loading = false;
        if (!this.authService.isStaff()) {
          this.errorMessage = 'Access denied: resident accounts must use the student portal.';
          this.authService.logout();
          return;
        }
        this.router.navigate(['/admin/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed';
      },
    });
  }
}
