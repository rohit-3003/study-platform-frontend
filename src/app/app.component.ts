import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Navbar (only for logged-in users) -->
    <nav class="navbar" *ngIf="auth.isLoggedIn">
      <div class="nav-container">
        <a routerLink="/dashboard" class="nav-brand">
          <span class="brand-icon">🎯</span>
          <span class="brand-text">StudyAI</span>
        </a>
        <div class="nav-links">
          <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" id="nav-dashboard">
            <span class="nav-icon">📊</span> Dashboard
          </a>
          <a routerLink="/study-planner" routerLinkActive="active" id="nav-planner">
            <span class="nav-icon">📅</span> Study Plan
          </a>
          <a routerLink="/mock-tests" routerLinkActive="active" id="nav-tests">
            <span class="nav-icon">📝</span> Mock Tests
          </a>
          <a routerLink="/rank-predictor" routerLinkActive="active" id="nav-rank">
            <span class="nav-icon">🏆</span> Rank Predictor
          </a>
          <a routerLink="/subscription" routerLinkActive="active" id="nav-subscription">
            <span class="nav-icon">💎</span> Plans
          </a>
        </div>
        <div class="nav-user">
          <a routerLink="/profile" class="user-avatar" id="nav-profile" title="Profile">
            {{ getInitials() }}
          </a>
        </div>
        <button class="mobile-menu-btn" (click)="toggleMobile()" id="mobile-menu-toggle">☰</button>
      </div>
      <!-- Mobile Menu -->
      <div class="mobile-menu" [class.open]="mobileOpen">
        <a routerLink="/dashboard" routerLinkActive="active" (click)="mobileOpen=false">📊 Dashboard</a>
        <a routerLink="/study-planner" routerLinkActive="active" (click)="mobileOpen=false">📅 Study Plan</a>
        <a routerLink="/mock-tests" routerLinkActive="active" (click)="mobileOpen=false">📝 Mock Tests</a>
        <a routerLink="/rank-predictor" routerLinkActive="active" (click)="mobileOpen=false">🏆 Rank Predictor</a>
        <a routerLink="/subscription" routerLinkActive="active" (click)="mobileOpen=false">💎 Plans</a>
        <a routerLink="/profile" routerLinkActive="active" (click)="mobileOpen=false">👤 Profile</a>
        <button class="btn btn-secondary" style="margin-top:8px" (click)="auth.logout()">Logout</button>
      </div>
    </nav>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div *ngFor="let toast of (toastService.toasts$ | async)" class="toast toast-{{toast.type}}"
           (click)="toastService.remove(toast.id)">
        {{ toast.message }}
      </div>
    </div>

    <main [class.with-nav]="auth.isLoggedIn">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: rgba(15,15,26,0.95);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      position: fixed; top: 0; left: 0; right: 0;
      z-index: 1000;
    }
    .nav-container {
      max-width: 1200px; margin: 0 auto;
      padding: 0 20px; height: 64px;
      display: flex; align-items: center; gap: 24px;
    }
    .nav-brand {
      display: flex; align-items: center; gap: 8px;
      font-size: 1.3rem; font-weight: 800;
      color: var(--text-primary) !important;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .nav-links { display: flex; gap: 2px; flex: 1; }
    .nav-links a {
      padding: 8px 12px; border-radius: var(--radius-sm);
      color: var(--text-secondary); font-size: 0.88rem; font-weight: 500;
      display: flex; align-items: center; gap: 6px;
      transition: var(--transition);
    }
    .nav-links a:hover { color: var(--text-primary); background: var(--bg-card); }
    .nav-links a.active { color: var(--primary-light); background: rgba(99,102,241,0.15); }
    .nav-icon { font-size: 1rem; }
    .nav-user { display: flex; align-items: center; }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--gradient-primary); color: white !important;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; cursor: pointer;
      transition: var(--transition);
    }
    .user-avatar:hover { transform: scale(1.1); box-shadow: var(--shadow-glow); }
    .mobile-menu-btn {
      display: none; background: none; border: none;
      color: var(--text-primary); font-size: 1.5rem; cursor: pointer;
    }
    .mobile-menu {
      display: none; flex-direction: column; padding: 12px 16px;
      border-top: 1px solid var(--border); gap: 4px;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu a {
      padding: 12px 16px; color: var(--text-secondary);
      border-radius: var(--radius-sm); font-size: 0.95rem;
    }
    .mobile-menu a.active { color: var(--primary-light); background: rgba(99,102,241,0.15); }
    main.with-nav { padding-top: 80px; }
    main { min-height: 100vh; }
    .toast-container {
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      display: flex; flex-direction: column; gap: 8px;
    }
    @media (max-width: 768px) {
      .nav-links, .nav-user { display: none; }
      .mobile-menu-btn { display: block; margin-left: auto; }
    }
  `]
})
export class AppComponent {
  mobileOpen = false;

  constructor(public auth: AuthService, public toastService: ToastService) {}

  toggleMobile() { this.mobileOpen = !this.mobileOpen; }

  getInitials(): string {
    const name = this.auth.currentUser?.fullName || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }
}
