import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container fade-in">
        <div class="auth-header">
          <span class="auth-logo">🎯</span>
          <h1>Welcome Back</h1>
          <p>Login to continue your preparation</p>
        </div>
        <form (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" class="form-control" [(ngModel)]="email"
                   name="email" placeholder="you@example.com" required>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" class="form-control" [(ngModel)]="password"
                   name="password" placeholder="••••••••" required>
          </div>
          <div *ngIf="error" class="form-error" style="margin-bottom:12px">{{ error }}</div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%" [disabled]="loading" id="btn-login">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/signup">Sign up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: var(--bg-primary);
      background-image: radial-gradient(ellipse at top, rgba(99,102,241,0.12) 0%, transparent 50%);
    }
    .auth-container {
      width: 100%; max-width: 420px; padding: 40px;
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--radius-lg);
    }
    .auth-header { text-align: center; margin-bottom: 32px; }
    .auth-logo { font-size: 3rem; display: block; margin-bottom: 12px; }
    .auth-header h1 { font-size: 1.6rem; font-weight: 700; }
    .auth-header p { color: var(--text-secondary); margin-top: 4px; }
    .auth-form { margin-bottom: 20px; }
    .auth-footer { text-align: center; color: var(--text-secondary); font-size: 0.9rem; }
  `]
})
export class LoginComponent {
  email = ''; password = ''; error = ''; loading = false;
  constructor(private auth: AuthService, private router: Router) {}
  onLogin() {
    this.loading = true; this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => { this.router.navigate(['/dashboard']); },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Check your credentials.';
        this.loading = false;
      }
    });
  }
}
