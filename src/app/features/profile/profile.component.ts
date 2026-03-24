import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h1>👤 Profile & Settings</h1>
        <p>Manage your account and preferences</p>
      </div>
      <div class="grid-2">
        <!-- Profile Card -->
        <div class="card profile-card">
          <div class="avatar">{{ getInitials() }}</div>
          <h2>{{ auth.currentUser?.fullName }}</h2>
          <p class="email">{{ auth.currentUser?.email }}</p>
          <div class="badges">
            <span class="badge badge-primary">{{ auth.currentUser?.examType || 'No exam selected' }}</span>
            <span class="badge" [class]="auth.currentUser?.subscriptionPlan === 'PRO' ? 'badge-success' : 'badge-warning'">
              {{ auth.currentUser?.subscriptionPlan || 'FREE' }} Plan
            </span>
          </div>
        </div>
        <!-- Subscription Status -->
        <div class="card">
          <h3 style="margin-bottom:16px">💎 Subscription</h3>
          <div *ngIf="subscription">
            <div class="sub-info">
              <div class="sub-plan">
                <span class="plan-badge" [class]="subscription.planType === 'PRO' ? 'pro' : 'free'">
                  {{ subscription.planType }}
                </span>
                <span class="sub-status badge" [class]="subscription.isActive ? 'badge-success' : 'badge-error'">
                  {{ subscription.status }}
                </span>
              </div>
              <p *ngIf="subscription.expiresAt" style="color:var(--text-muted);font-size:0.85rem;margin-top:8px">
                Expires: {{ subscription.expiresAt }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings -->
      <div class="card" style="margin-top:24px">
        <h3 style="margin-bottom:20px">⚙️ Account Settings</h3>
        <form (ngSubmit)="updateProfile()">
          <div class="grid-2">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="profileForm.fullName" name="fullName">
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" class="form-control" [(ngModel)]="profileForm.phone" name="phone" placeholder="+91 XXXXX XXXXX">
            </div>
            <div class="form-group">
              <label>Target Exam</label>
              <select class="form-control" [(ngModel)]="profileForm.examType" name="examType">
                <option value="UPSC">UPSC</option>
                <option value="SSC">SSC</option>
                <option value="BANKING">Banking</option>
                <option value="STATE_GOV">State Government</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" id="btn-save-profile">Save Changes</button>
        </form>
      </div>

      <!-- Study Stats Summary -->
      <div class="card" style="margin-top:24px">
        <h3 style="margin-bottom:16px">📊 Your Journey</h3>
        <div class="grid-4">
          <div class="journey-stat">
            <span class="journey-icon">📅</span>
            <span class="journey-value">{{ stats.daysActive || 0 }}</span>
            <span class="journey-label">Days Active</span>
          </div>
          <div class="journey-stat">
            <span class="journey-icon">📝</span>
            <span class="journey-value">{{ stats.totalTests || 0 }}</span>
            <span class="journey-label">Tests Taken</span>
          </div>
          <div class="journey-stat">
            <span class="journey-icon">🎯</span>
            <span class="journey-value">{{ stats.avgScore || 0 }}%</span>
            <span class="journey-label">Avg Score</span>
          </div>
          <div class="journey-stat">
            <span class="journey-icon">🔥</span>
            <span class="journey-value">{{ stats.streak || 0 }}</span>
            <span class="journey-label">Day Streak</span>
          </div>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card danger-card" style="margin-top:24px">
        <h3 style="margin-bottom:12px;color:var(--error)">⚠️ Danger Zone</h3>
        <p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.9rem">
          Logging out will clear your session. You can log back in anytime.
        </p>
        <button class="btn btn-outline" style="border-color:var(--error);color:var(--error)"
                (click)="auth.logout()">Logout</button>
      </div>
    </div>
  `,
  styles: [`
    .profile-card { text-align: center; padding: 40px; }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 16px;
      background: var(--gradient-primary); display: flex; align-items: center;
      justify-content: center; font-size: 1.8rem; font-weight: 800; color: white;
    }
    .email { color: var(--text-muted); margin: 4px 0 16px; }
    .badges { display: flex; gap: 8px; justify-content: center; }
    .sub-info { padding: 16px; background: var(--bg-input); border-radius: var(--radius-sm); }
    .sub-plan { display: flex; align-items: center; gap: 12px; }
    .plan-badge {
      font-size: 1.2rem; font-weight: 800; padding: 8px 20px; border-radius: var(--radius-sm);
    }
    .plan-badge.pro { background: var(--gradient-primary); color: white; }
    .plan-badge.free { background: var(--bg-card); color: var(--text-secondary); border: 1px solid var(--border); }
    .journey-stat {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 16px; background: var(--bg-input); border-radius: var(--radius-sm);
    }
    .journey-icon { font-size: 1.4rem; }
    .journey-value { font-size: 1.5rem; font-weight: 700; }
    .journey-label { font-size: 0.8rem; color: var(--text-muted); }
    .danger-card { border-color: rgba(239,68,68,0.3); }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm = { fullName: '', phone: '', examType: 'UPSC' };
  subscription: any = null;
  stats = { daysActive: 0, totalTests: 0, avgScore: 0, streak: 0 };

  constructor(public auth: AuthService, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user) {
      this.profileForm.fullName = user.fullName;
      this.profileForm.examType = user.examType || 'UPSC';
    }
    this.api.getCurrentSubscription().subscribe({
      next: (res: any) => { if (res.success) this.subscription = res.data; }
    });
    this.api.getDashboardStats().subscribe({
      next: (res: any) => {
        if (res.success) {
          this.stats.totalTests = res.data.totalTestsTaken;
          this.stats.avgScore = res.data.averageScore;
          this.stats.streak = res.data.currentStreak;
        }
      }
    });
  }

  getInitials(): string {
    const name = this.auth.currentUser?.fullName || 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  updateProfile() {
    this.toast.success('Profile updated successfully!');
  }
}
