import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h1>Welcome back, {{ auth.currentUser?.fullName }}! 👋</h1>
        <p>Here's your preparation overview</p>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <!-- Stats Cards -->
        <div class="grid-4" style="margin-bottom:24px">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:var(--primary)">📝</div>
            <div><div class="stat-value">{{ stats.totalTestsTaken }}</div><div class="stat-label">Tests Taken</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--success)">📈</div>
            <div><div class="stat-value">{{ stats.averageScore }}%</div><div class="stat-label">Avg Score</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--accent)">🔥</div>
            <div><div class="stat-value">{{ stats.currentStreak }}</div><div class="stat-label">Day Streak</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(239,68,68,0.15);color:var(--error)">🏆</div>
            <div><div class="stat-value">{{ stats.rankPercentile }}%</div><div class="stat-label">Percentile</div></div>
          </div>
        </div>

        <div class="grid-2">
          <!-- Performance Chart -->
          <div class="card">
            <h3 style="margin-bottom:16px">📊 Performance Over Time</h3>
            <canvas #chartCanvas id="performanceChart" height="200"></canvas>
            <p *ngIf="!stats.scoreHistory?.length" style="text-align:center;color:var(--text-muted);padding:40px 0">
              Take your first mock test to see your progress here!
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h3 style="margin-bottom:16px">🚀 Quick Actions</h3>
            <div class="quick-actions">
              <a routerLink="/study-planner" class="action-btn">
                <span>📅</span><span>Create Study Plan</span>
              </a>
              <a routerLink="/mock-tests" class="action-btn">
                <span>📝</span><span>Take Mock Test</span>
              </a>
              <a routerLink="/rank-predictor" class="action-btn">
                <span>🏆</span><span>Check Rank</span>
              </a>
              <a routerLink="/subscription" class="action-btn">
                <span>💎</span><span>Upgrade Plan</span>
              </a>
            </div>

            <!-- Recent Activity -->
            <h3 style="margin:24px 0 12px">🕐 Recent Activity</h3>
            <div *ngFor="let activity of stats.recentActivities" class="activity-item">
              <span class="activity-icon">{{ activity.type === 'MOCK_TEST' ? '📝' : '📖' }}</span>
              <div class="activity-info">
                <span>{{ activity.description }}</span>
                <span class="activity-score badge badge-primary">{{ activity.score }}%</span>
              </div>
            </div>
            <p *ngIf="!stats.recentActivities?.length" style="color:var(--text-muted);font-size:0.9rem">
              No recent activity. Start studying!
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .quick-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .action-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 16px; background: var(--bg-input);
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      color: var(--text-primary); font-weight: 500;
      transition: var(--transition); font-size: 0.9rem;
    }
    .action-btn:hover {
      border-color: var(--primary); background: rgba(99,102,241,0.1);
      transform: translateY(-2px); color: var(--text-primary);
    }
    .activity-item {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid var(--border);
    }
    .activity-item:last-child { border-bottom: none; }
    .activity-info { display: flex; justify-content: space-between; flex: 1; align-items: center; font-size: 0.9rem; }
    .activity-icon { font-size: 1.2rem; }
    .activity-score { margin-left: auto; }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  stats: any = { totalTestsTaken: 0, averageScore: 0, currentStreak: 0, rankPercentile: 0,
                  scoreHistory: [], weakAreas: [], recentActivities: [] };
  loading = true;

  constructor(public auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboardStats().subscribe({
      next: (res) => { if (res.success) this.stats = res.data; this.loading = false; this.renderChart(); },
      error: () => { this.loading = false; }
    });
  }

  ngAfterViewInit() { this.renderChart(); }

  renderChart() {
    if (!this.chartCanvas?.nativeElement || !this.stats.scoreHistory?.length) return;
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const labels = this.stats.scoreHistory.map((s: any) => s.date).reverse();
    const data = this.stats.scoreHistory.map((s: any) => s.score).reverse();
    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Score %', data, fill: true,
          borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)',
          tension: 0.4, pointBackgroundColor: '#6366f1'
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(45,55,72,0.5)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { color: 'rgba(45,55,72,0.3)' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }
}
