import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-test-taking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container fade-in">
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>

      <!-- Test Interface -->
      <div *ngIf="!loading && test && !submitted">
        <div class="test-header">
          <div>
            <h2>{{ test.title }}</h2>
            <div class="test-badges">
              <span class="badge badge-primary">{{ test.examType }}</span>
              <span class="badge badge-warning">{{ test.difficulty }}</span>
            </div>
          </div>
          <div class="timer" [class.urgent]="timeLeft < 60">
            ⏱️ {{ formatTime(timeLeft) }}
          </div>
        </div>

        <!-- Progress -->
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="(answeredCount / test.questions.length) * 100"></div>
        </div>
        <p style="font-size:0.85rem;color:var(--text-muted);margin:8px 0 20px">
          {{ answeredCount }}/{{ test.questions.length }} answered
        </p>

        <!-- Question -->
        <div class="question-card card">
          <div class="question-num">Question {{ currentIndex + 1 }} of {{ test.questions.length }}</div>
          <h3 class="question-text">{{ currentQ?.questionText }}</h3>
          <div class="options">
            <label *ngFor="let opt of currentQ?.options; let i = index" class="option-label"
                   [class.selected]="answers[currentQ?.id] === opt">
              <input type="radio" [name]="'q_' + currentQ?.id" [value]="opt"
                     [(ngModel)]="answers[currentQ?.id]">
              <span class="option-letter">{{ ['A','B','C','D'][i] }}</span>
              <span>{{ opt }}</span>
            </label>
          </div>
        </div>

        <!-- Navigation -->
        <div class="question-nav">
          <button class="btn btn-secondary" (click)="prev()" [disabled]="currentIndex === 0">← Previous</button>
          <div class="nav-dots">
            <span *ngFor="let q of test.questions; let i = index" class="dot"
                  [class.active]="i === currentIndex"
                  [class.answered]="answers[q.id]"
                  (click)="currentIndex = i">{{ i + 1 }}</span>
          </div>
          <button *ngIf="currentIndex < test.questions.length - 1" class="btn btn-primary" (click)="next()">
            Next →
          </button>
          <button *ngIf="currentIndex === test.questions.length - 1" class="btn btn-success" (click)="submitTest()" id="btn-submit-test">
            Submit Test ✓
          </button>
        </div>
      </div>

      <!-- Results -->
      <div *ngIf="submitted && result" class="results fade-in">
        <div class="result-header">
          <h1>📊 Test Results</h1>
          <div class="result-score-circle">
            <span class="score-val">{{ result.percentage | number:'1.0-0' }}%</span>
            <span class="score-label">Score</span>
          </div>
        </div>
        <div class="grid-3" style="margin:24px 0">
          <div class="stat-card"><div class="stat-icon" style="background:rgba(16,185,129,0.15);color:var(--success)">✅</div>
            <div><div class="stat-value">{{ result.score }}/{{ result.totalMarks }}</div><div class="stat-label">Correct</div></div></div>
          <div class="stat-card"><div class="stat-icon" style="background:rgba(99,102,241,0.15);color:var(--primary)">📈</div>
            <div><div class="stat-value">{{ result.rankPercentile | number:'1.0-0' }}%</div><div class="stat-label">Percentile</div></div></div>
          <div class="stat-card"><div class="stat-icon" style="background:rgba(245,158,11,0.15);color:var(--accent)">⏱️</div>
            <div><div class="stat-value">{{ formatTime(result.timeTaken) }}</div><div class="stat-label">Time Taken</div></div></div>
        </div>

        <!-- Detailed Review -->
        <h3 style="margin:24px 0 16px">Detailed Review</h3>
        <div *ngFor="let q of result.detailedResults; let i = index" class="review-item card" [class.correct]="q.isCorrect" [class.wrong]="!q.isCorrect">
          <div class="review-header">
            <span class="review-num">Q{{ i + 1 }}</span>
            <span class="badge" [class]="q.isCorrect ? 'badge-success' : 'badge-error'">
              {{ q.isCorrect ? 'Correct' : 'Wrong' }}
            </span>
          </div>
          <p class="review-q">{{ q.questionText }}</p>
          <p><strong>Your Answer:</strong> <span [style.color]="q.isCorrect ? 'var(--success)' : 'var(--error)'">{{ q.userAnswer || 'Not answered' }}</span></p>
          <p><strong>Correct Answer:</strong> <span style="color:var(--success)">{{ q.correctAnswer }}</span></p>
          <p *ngIf="q.explanation" class="review-exp">💡 {{ q.explanation }}</p>
        </div>
        <button class="btn btn-primary btn-lg" style="margin-top:24px" (click)="goBack()" id="btn-back-tests">← Back to Tests</button>
      </div>
    </div>
  `,
  styles: [`
    .test-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .test-badges { display: flex; gap: 8px; margin-top: 6px; }
    .timer { font-size: 1.5rem; font-weight: 700; color: var(--primary-light); font-variant-numeric: tabular-nums; }
    .timer.urgent { color: var(--error); animation: pulse 1s infinite; }
    @keyframes pulse { 50% { opacity: 0.6; } }
    .progress-bar { height: 6px; background: var(--bg-input); border-radius: 3px; overflow: hidden; }
    .progress-fill { height: 100%; background: var(--gradient-primary); transition: width 0.3s; border-radius: 3px; }
    .question-card { margin-bottom: 20px; }
    .question-num { font-size: 0.85rem; color: var(--primary-light); font-weight: 600; margin-bottom: 12px; }
    .question-text { font-size: 1.1rem; line-height: 1.7; margin-bottom: 20px; }
    .options { display: flex; flex-direction: column; gap: 10px; }
    .option-label {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px; background: var(--bg-input);
      border: 2px solid var(--border); border-radius: var(--radius-sm);
      cursor: pointer; transition: var(--transition);
    }
    .option-label:hover { border-color: var(--primary); }
    .option-label.selected { border-color: var(--primary); background: rgba(99,102,241,0.1); }
    .option-label input { display: none; }
    .option-letter {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--bg-card); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.85rem;
    }
    .selected .option-letter { background: var(--primary); color: white; border-color: var(--primary); }
    .question-nav { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
    .nav-dots { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; justify-content: center; }
    .dot {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--bg-input); border: 1px solid var(--border);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; cursor: pointer; transition: var(--transition);
    }
    .dot.active { border-color: var(--primary); color: var(--primary); }
    .dot.answered { background: var(--primary); color: white; border-color: var(--primary); }
    .result-header { text-align: center; margin-bottom: 20px; }
    .result-score-circle {
      width: 120px; height: 120px; border-radius: 50%; margin: 20px auto;
      background: var(--gradient-primary);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .score-val { font-size: 2rem; font-weight: 800; color: white; }
    .score-label { font-size: 0.8rem; color: rgba(255,255,255,0.7); }
    .review-item { margin-bottom: 12px; border-left: 3px solid var(--border); }
    .review-item.correct { border-left-color: var(--success); }
    .review-item.wrong { border-left-color: var(--error); }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .review-num { font-weight: 700; color: var(--primary-light); }
    .review-q { margin-bottom: 8px; line-height: 1.5; }
    .review-exp { margin-top: 8px; padding: 10px; background: rgba(99,102,241,0.08); border-radius: var(--radius-sm); font-size: 0.9rem; color: var(--text-secondary); }
  `]
})
export class TestTakingComponent implements OnInit, OnDestroy {
  test: any = null; loading = true; submitted = false; result: any = null;
  currentIndex = 0; answers: any = {}; timer: any; timeLeft = 0; startTime = 0;

  get currentQ() { return this.test?.questions?.[this.currentIndex]; }
  get answeredCount() { return Object.keys(this.answers).filter(k => this.answers[k]).length; }

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getTest(Number(id)).subscribe({
      next: (res) => {
        if (res.success) {
          this.test = res.data;
          if (this.test.status === 'COMPLETED') { this.loadResult(); }
          else {
            this.timeLeft = this.test.durationMinutes * 60;
            this.startTime = Date.now();
            this.startTimer();
          }
        }
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  startTimer() {
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) { clearInterval(this.timer); this.submitTest(); }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60); const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  prev() { if (this.currentIndex > 0) this.currentIndex--; }
  next() { if (this.currentIndex < this.test.questions.length - 1) this.currentIndex++; }

  submitTest() {
    if (this.timer) clearInterval(this.timer);
    const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
    const answersArr = this.test.questions.map((q: any) => ({
      questionId: q.id, answer: this.answers[q.id] || '', timeSpentSeconds: 0
    }));
    this.api.submitTest({ testId: this.test.id, answers: answersArr, timeTakenSeconds: timeTaken }).subscribe({
      next: (res) => { if (res.success) { this.result = res.data; this.submitted = true; } },
      error: () => {}
    });
  }

  loadResult() {
    this.submitted = true;
    // Already completed, result embedded
  }

  goBack() { this.router.navigate(['/mock-tests']); }
}
