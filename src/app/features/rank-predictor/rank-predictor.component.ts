import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-rank-predictor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h1>🏆 Rank Predictor</h1>
        <p>AI-powered rank prediction based on your mock test performance</p>
      </div>
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div *ngIf="!loading && prediction">
        <!-- Main Rank Card -->
        <div class="rank-hero card-glass" style="text-align:center;margin-bottom:24px;padding:40px">
          <p style="font-size:1.1rem;color:var(--text-secondary);margin-bottom:8px">Your Estimated Rank</p>
          <div class="rank-number">{{ prediction.estimatedRank > 0 ? '#' + prediction.estimatedRank : 'N/A' }}</div>
          <p style="color:var(--text-muted);margin-top:4px">out of {{ prediction.totalCandidates | number }} candidates</p>
          <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <span class="badge badge-primary" style="font-size:0.9rem;padding:8px 16px">{{ prediction.examType }}</span>
            <span class="badge badge-success" style="font-size:0.9rem;padding:8px 16px">{{ prediction.percentile }}th Percentile</span>
          </div>
        </div>
        <div class="grid-3" style="margin-bottom:24px">
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(99,102,241,0.15);color:var(--primary)">📊</div>
            <div><div class="stat-value">{{ prediction.averageScore }}%</div><div class="stat-label">Avg Score</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--success)">📈</div>
            <div><div class="stat-value">{{ prediction.percentile }}%</div><div class="stat-label">Percentile</div></div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--accent)">🏆</div>
            <div><div class="stat-value">#{{ prediction.estimatedRank }}</div><div class="stat-label">Est. Rank</div></div>
          </div>
        </div>
        <!-- Recommendation -->
        <div class="card" style="border-left:3px solid var(--primary)">
          <h3 style="margin-bottom:8px">💡 AI Recommendation</h3>
          <p style="color:var(--text-secondary);line-height:1.7">{{ prediction.recommendation }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rank-number {
      font-size: 4rem; font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      line-height: 1;
    }
  `]
})
export class RankPredictorComponent implements OnInit {
  prediction: any = null; loading = true;
  constructor(private api: ApiService, public auth: AuthService) {}
  ngOnInit() {
    this.api.getRankPrediction().subscribe({
      next: (res) => { if (res.success) this.prediction = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
