import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-study-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h1>📅 AI Study Planner</h1>
        <p>Generate a personalized study schedule powered by AI</p>
      </div>

      <div class="grid-2">
        <!-- Create Plan Form -->
        <div class="card">
          <h3 style="margin-bottom:20px">Create New Plan</h3>
          <form (ngSubmit)="createPlan()">
            <div class="form-group">
              <label>Target Exam</label>
              <select class="form-control" [(ngModel)]="form.examType" name="examType" id="exam-select">
                <option value="UPSC">UPSC</option>
                <option value="SSC">SSC</option>
                <option value="BANKING">Banking</option>
                <option value="STATE_GOV">State Government</option>
              </select>
            </div>
            <div class="form-group">
              <label>Available Hours/Day</label>
              <input type="number" class="form-control" [(ngModel)]="form.availableHoursPerDay"
                     name="hours" min="1" max="16" placeholder="e.g. 6" id="hours-input">
            </div>
            <div class="form-group">
              <label>Strong Subjects (comma separated)</label>
              <input type="text" class="form-control" [(ngModel)]="strengthsStr"
                     name="strengths" placeholder="e.g. Polity, Geography" id="strengths-input">
            </div>
            <div class="form-group">
              <label>Weak Subjects (comma separated)</label>
              <input type="text" class="form-control" [(ngModel)]="weaknessesStr"
                     name="weaknesses" placeholder="e.g. Economy, Math" id="weaknesses-input">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%"
                    [disabled]="generating" id="btn-generate-plan">
              {{ generating ? '🤖 AI is generating your plan...' : '✨ Generate Study Plan' }}
            </button>
          </form>
        </div>

        <!-- Active Plan Display -->
        <div class="card">
          <h3 style="margin-bottom:20px">Your Active Plan</h3>
          <div *ngIf="loadingPlan" class="loading-container" style="min-height:200px"><div class="spinner"></div></div>
          <div *ngIf="!loadingPlan && !activePlan" style="text-align:center;padding:40px 0;color:var(--text-muted)">
            <p style="font-size:2rem;margin-bottom:8px">📋</p>
            <p>No active plan yet. Create one!</p>
          </div>
          <div *ngIf="activePlan">
            <div class="plan-meta">
              <span class="badge badge-primary">{{ activePlan.examType }}</span>
              <span class="badge badge-success">{{ activePlan.availableHoursPerDay }}h/day</span>
            </div>
            <div *ngIf="activePlan.planData?.recommendations" class="recs">
              <h4 style="margin:16px 0 8px;font-size:0.9rem;color:var(--text-secondary)">💡 Recommendations</h4>
              <ul>
                <li *ngFor="let r of activePlan.planData.recommendations">{{ r }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Schedule -->
      <div *ngIf="activePlan?.planData?.weeklyPlan" class="card" style="margin-top:24px">
        <h3 style="margin-bottom:20px">📆 Weekly Schedule</h3>
        <div class="schedule-grid">
          <div *ngFor="let day of activePlan.planData.weeklyPlan" class="day-card">
            <div class="day-header">{{ day.day }}</div>
            <div *ngFor="let session of day.sessions" class="session-item"
                 [class.high-priority]="session.priority === 3">
              <div class="session-time">{{ session.startTime }} - {{ session.endTime }}</div>
              <div class="session-subject">{{ session.subject }}</div>
              <div class="session-topic">{{ session.topic }}</div>
              <div *ngIf="session.tips" class="session-tips">💡 {{ session.tips }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plan-meta { display: flex; gap: 8px; margin-bottom: 16px; }
    .recs ul { padding-left: 20px; }
    .recs li { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 6px; }
    .schedule-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
    .day-card { background: var(--bg-input); border-radius: var(--radius-sm); overflow: hidden; }
    .day-header {
      padding: 10px 16px; font-weight: 700;
      background: var(--gradient-primary); color: white; text-align: center;
    }
    .session-item {
      padding: 12px 16px; border-bottom: 1px solid var(--border);
      transition: var(--transition);
    }
    .session-item:hover { background: rgba(99,102,241,0.05); }
    .session-item.high-priority { border-left: 3px solid var(--primary); }
    .session-time { font-size: 0.8rem; color: var(--primary-light); font-weight: 600; }
    .session-subject { font-weight: 600; margin: 4px 0 2px; }
    .session-topic { font-size: 0.85rem; color: var(--text-secondary); }
    .session-tips { font-size: 0.8rem; color: var(--accent); margin-top: 6px; }
  `]
})
export class StudyPlannerComponent implements OnInit {
  form = { examType: 'UPSC', availableHoursPerDay: 6, strengths: [] as string[], weaknesses: [] as string[] };
  strengthsStr = ''; weaknessesStr = '';
  activePlan: any = null; generating = false; loadingPlan = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getActivePlan().subscribe({
      next: (res) => { if (res.success) this.activePlan = res.data; this.loadingPlan = false; },
      error: () => { this.loadingPlan = false; }
    });
  }

  createPlan() {
    this.generating = true;
    this.form.strengths = this.strengthsStr.split(',').map(s => s.trim()).filter(s => s);
    this.form.weaknesses = this.weaknessesStr.split(',').map(s => s.trim()).filter(s => s);
    this.api.createStudyPlan(this.form).subscribe({
      next: (res) => { if (res.success) this.activePlan = res.data; this.generating = false; },
      error: () => { this.generating = false; }
    });
  }
}
