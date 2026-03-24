import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing">
      <!-- Hero -->
      <section class="hero">
        <div class="hero-bg"></div>
        <div class="container hero-content">
          <div class="hero-badge fade-in">🇮🇳 India's #1 AI Exam Prep Platform</div>
          <h1 class="hero-title fade-in">
            Crack Your <span class="gradient-text">Government Exam</span> with AI
          </h1>
          <p class="hero-subtitle fade-in">
            AI-powered study plans, mock tests, and rank prediction for UPSC, SSC, Banking & State Govt exams.
            Join 1 lakh+ students preparing smarter.
          </p>
          <div class="hero-actions fade-in">
            <a routerLink="/signup" class="btn btn-primary btn-lg" id="hero-signup">
              🚀 Start Free Preparation
            </a>
            <a routerLink="/login" class="btn btn-outline btn-lg" id="hero-login">
              Login →
            </a>
          </div>
          <div class="hero-stats fade-in">
            <div class="hero-stat"><span class="hero-stat-value">1L+</span><span class="hero-stat-label">Students</span></div>
            <div class="hero-stat"><span class="hero-stat-value">50K+</span><span class="hero-stat-label">Questions</span></div>
            <div class="hero-stat"><span class="hero-stat-value">95%</span><span class="hero-stat-label">Satisfaction</span></div>
            <div class="hero-stat"><span class="hero-stat-value">4.8⭐</span><span class="hero-stat-label">Rating</span></div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="features container">
        <h2 class="section-title">✨ Why StudyAI?</h2>
        <div class="grid-3 features-grid">
          <div class="feature-card card">
            <span class="feature-icon">🤖</span>
            <h3>AI Study Planner</h3>
            <p>Get a personalized study schedule based on your strengths, weaknesses, and available time. Adapts as you progress.</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">📝</span>
            <h3>Smart Mock Tests</h3>
            <p>AI generates exam-specific questions with difficulty levels. Instant scoring with detailed explanations.</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">🏆</span>
            <h3>Rank Predictor</h3>
            <p>Know where you stand. Get your estimated rank and percentile compared to actual exam candidates.</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">📊</span>
            <h3>Performance Analytics</h3>
            <p>Track your progress with graphs, study streaks, and weak area detection. Stay motivated every day.</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">📱</span>
            <h3>Mobile Friendly</h3>
            <p>Study on-the-go with our fully responsive design. Works perfectly on phones, tablets, and desktops.</p>
          </div>
          <div class="feature-card card">
            <span class="feature-icon">💰</span>
            <h3>Affordable</h3>
            <p>Start free with 5 tests/month. Upgrade to Pro at just ₹499/month for unlimited access.</p>
          </div>
        </div>
      </section>

      <!-- Exams -->
      <section class="exams container">
        <h2 class="section-title">🎯 Exams We Cover</h2>
        <div class="grid-4 exam-grid">
          <div class="exam-card card">
            <span class="exam-icon">🏛️</span>
            <h3>UPSC</h3>
            <p>IAS, IPS, IFS & more</p>
          </div>
          <div class="exam-card card">
            <span class="exam-icon">📋</span>
            <h3>SSC</h3>
            <p>CGL, CHSL, MTS</p>
          </div>
          <div class="exam-card card">
            <span class="exam-icon">🏦</span>
            <h3>Banking</h3>
            <p>IBPS, SBI, RBI</p>
          </div>
          <div class="exam-card card">
            <span class="exam-icon">🏢</span>
            <h3>State Govt</h3>
            <p>BPSC, UPPSC, MPSC</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta">
        <div class="container" style="text-align:center">
          <h2 style="font-size:2rem;margin-bottom:12px">Ready to crack your exam? 🚀</h2>
          <p style="color:var(--text-secondary);margin-bottom:24px;font-size:1.1rem">
            Join thousands of students who are preparing smarter with AI
          </p>
          <a routerLink="/signup" class="btn btn-primary btn-lg">Get Started — It's Free</a>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="container" style="text-align:center">
          <p class="footer-brand">🎯 StudyAI</p>
          <p style="color:var(--text-muted);font-size:0.85rem">
            © 2026 StudyAI Platform. Built for India's future leaders.
          </p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing { overflow-x: hidden; }
    .hero {
      min-height: 90vh; display: flex; align-items: center;
      position: relative; overflow: hidden; padding: 40px 0;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at top center, rgba(99,102,241,0.2) 0%, transparent 60%),
                  radial-gradient(ellipse at bottom right, rgba(139,92,246,0.1) 0%, transparent 50%);
    }
    .hero-content { position: relative; text-align: center; max-width: 800px; margin: 0 auto; }
    .hero-badge {
      display: inline-block; padding: 8px 20px; border-radius: 20px;
      background: rgba(99,102,241,0.15); color: var(--primary-light);
      font-size: 0.9rem; font-weight: 600; margin-bottom: 24px;
      border: 1px solid rgba(99,102,241,0.3);
    }
    .hero-title { font-size: 3.2rem; font-weight: 800; line-height: 1.2; margin-bottom: 20px; }
    .gradient-text {
      background: var(--gradient-primary);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-subtitle { font-size: 1.15rem; color: var(--text-secondary); line-height: 1.7; margin-bottom: 32px; max-width: 600px; margin-left: auto; margin-right: auto; }
    .hero-actions { display: flex; gap: 16px; justify-content: center; margin-bottom: 48px; flex-wrap: wrap; }
    .hero-stats { display: flex; gap: 40px; justify-content: center; flex-wrap: wrap; }
    .hero-stat { text-align: center; }
    .hero-stat-value { display: block; font-size: 1.8rem; font-weight: 800; color: var(--primary-light); }
    .hero-stat-label { font-size: 0.85rem; color: var(--text-muted); }
    .section-title { text-align: center; font-size: 1.8rem; font-weight: 700; margin: 60px 0 32px; }
    .features-grid { max-width: 1000px; margin: 0 auto; }
    .feature-card { text-align: center; padding: 32px 24px; }
    .feature-icon { font-size: 2.5rem; display: block; margin-bottom: 16px; }
    .feature-card h3 { margin-bottom: 8px; }
    .feature-card p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
    .exam-grid { max-width: 800px; margin: 0 auto; }
    .exam-card { text-align: center; padding: 28px; }
    .exam-icon { font-size: 2rem; display: block; margin-bottom: 12px; }
    .exam-card h3 { margin-bottom: 4px; }
    .exam-card p { color: var(--text-muted); font-size: 0.85rem; }
    .cta { padding: 60px 0; margin-top: 40px; }
    .footer { padding: 32px 0; border-top: 1px solid var(--border); margin-top: 40px; }
    .footer-brand { font-size: 1.2rem; font-weight: 700; margin-bottom: 6px; }
    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .hero-stats { gap: 20px; }
    }
  `]
})
export class LandingComponent {}
