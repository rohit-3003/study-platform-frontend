import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-mock-test',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <div class="page-header">
        <h1>📝 Mock Tests</h1>
        <p>Generate AI-powered mock tests for your exam preparation</p>
      </div>
      <div class="grid-2">
        <!-- Create Test -->
        <div class="card">
          <h3 style="margin-bottom:20px">Create New Test</h3>
          <form (ngSubmit)="createTest()">
            <div class="form-group">
              <label>Exam Type</label>
              <select class="form-control" [(ngModel)]="form.examType" name="examType" id="test-exam-select">
                <option value="UPSC">UPSC</option><option value="SSC">SSC</option>
                <option value="BANKING">Banking</option><option value="STATE_GOV">State Government</option>
              </select>
            </div>
            <div class="form-group">
              <label>Difficulty</label>
              <select class="form-control" [(ngModel)]="form.difficulty" name="difficulty">
                <option value="EASY">Easy</option><option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div class="form-group">
              <label>Number of Questions</label>
              <input type="number" class="form-control" [(ngModel)]="form.totalQuestions"
                     name="totalQuestions" min="3" max="50" id="test-questions-input">
            </div>
            <div class="form-group">
              <label>Duration (minutes)</label>
              <input type="number" class="form-control" [(ngModel)]="form.durationMinutes"
                     name="duration" min="10" max="180">
            </div>
            <button type="submit" class="btn btn-primary btn-lg" style="width:100%"
                    [disabled]="creating" id="btn-create-test">
              {{ creating ? '🤖 Generating questions...' : '🚀 Generate Mock Test' }}
            </button>
          </form>
        </div>
        <!-- Test History -->
        <div class="card">
          <h3 style="margin-bottom:20px">Test History</h3>
          <div *ngIf="loadingTests" class="loading-container" style="min-height:200px"><div class="spinner"></div></div>
          <div *ngIf="!loadingTests && !tests.length" style="text-align:center;padding:40px 0;color:var(--text-muted)">
            <p style="font-size:2rem;margin-bottom:8px">📋</p><p>No tests taken yet</p>
          </div>
          <div *ngFor="let test of tests" class="test-item" (click)="openTest(test)">
            <div class="test-info">
              <span class="test-title">{{ test.title }}</span>
              <div class="test-meta">
                <span class="badge" [class]="test.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">
                  {{ test.status }}
                </span>
                <span class="badge badge-primary">{{ test.difficulty }}</span>
                <span style="color:var(--text-muted);font-size:0.8rem">{{ test.totalQuestions }} Qs</span>
              </div>
            </div>
            <span style="color:var(--primary-light);font-size:1.2rem">→</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .test-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 16px; margin-bottom: 8px; background: var(--bg-input);
      border: 1px solid var(--border); border-radius: var(--radius-sm);
      cursor: pointer; transition: var(--transition);
    }
    .test-item:hover { border-color: var(--primary); transform: translateX(4px); }
    .test-title { font-weight: 600; font-size: 0.95rem; display: block; margin-bottom: 6px; }
    .test-meta { display: flex; gap: 8px; align-items: center; }
  `]
})
export class MockTestComponent implements OnInit {
  form = { examType: 'UPSC', difficulty: 'MEDIUM', totalQuestions: 10, durationMinutes: 30 };
  tests: any[] = []; creating = false; loadingTests = true;
  constructor(private api: ApiService, private router: Router) {}
  ngOnInit() {
    this.api.getUserTests().subscribe({
      next: (res) => { if (res.success) this.tests = res.data; this.loadingTests = false; },
      error: () => { this.loadingTests = false; }
    });
  }
  createTest() {
    this.creating = true;
    this.api.createMockTest(this.form).subscribe({
      next: (res) => {
        if (res.success) { this.router.navigate(['/mock-tests', res.data.id]); }
        this.creating = false;
      },
      error: () => { this.creating = false; }
    });
  }
  openTest(test: any) { this.router.navigate(['/mock-tests', test.id]); }
}
