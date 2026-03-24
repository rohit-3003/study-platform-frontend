import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

declare var Razorpay: any;

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container fade-in">
      <div class="page-header" style="text-align:center">
        <h1>💎 Subscription Plans</h1>
        <p>Choose the plan that fits your preparation needs</p>
      </div>
      <div *ngIf="loading" class="loading-container"><div class="spinner"></div></div>
      <div *ngIf="!loading" class="plans-grid">
        <div *ngFor="let plan of plans" class="plan-card card" [class.featured]="plan.price > 0">
          <div *ngIf="plan.price > 0" class="featured-badge">Most Popular</div>
          <h2 class="plan-name">{{ plan.name }}</h2>
          <div class="plan-price">
            <span class="price-amount">{{ plan.price === 0 ? 'Free' : '₹' + plan.price }}</span>
            <span *ngIf="plan.price > 0" class="price-period">/month</span>
          </div>
          <p class="plan-desc">{{ plan.description }}</p>
          <ul class="plan-features">
            <li *ngFor="let f of plan.features">✅ {{ f }}</li>
          </ul>
          <button *ngIf="plan.price === 0" class="btn btn-secondary btn-lg" style="width:100%" disabled>
            {{ currentPlan === 'FREE' ? 'Current Plan' : 'Free' }}
          </button>
          <button *ngIf="plan.price > 0" class="btn btn-primary btn-lg" style="width:100%"
                  (click)="subscribe()" [disabled]="processing || currentPlan === 'PRO'" id="btn-subscribe">
            {{ currentPlan === 'PRO' ? '✓ Active' : processing ? 'Processing...' : 'Subscribe Now' }}
          </button>
        </div>
      </div>
      <!-- Current Subscription -->
      <div *ngIf="currentSub" class="card" style="margin-top:32px">
        <h3 style="margin-bottom:12px">Your Subscription</h3>
        <div style="display:flex;gap:12px;align-items:center">
          <span class="badge" [class]="currentSub.isActive ? 'badge-success' : 'badge-error'" style="font-size:0.9rem;padding:8px 16px">
            {{ currentSub.planType }} — {{ currentSub.status }}
          </span>
          <span *ngIf="currentSub.expiresAt" style="color:var(--text-muted);font-size:0.85rem">
            Expires: {{ currentSub.expiresAt | date:'mediumDate' }}
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; max-width: 700px; margin: 0 auto; }
    .plan-card { text-align: center; position: relative; padding: 32px; }
    .plan-card.featured { border-color: var(--primary); box-shadow: var(--shadow-glow); }
    .featured-badge {
      position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
      background: var(--gradient-primary); color: white;
      padding: 4px 20px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
    }
    .plan-name { font-size: 1.3rem; margin-bottom: 12px; }
    .plan-price { margin-bottom: 12px; }
    .price-amount { font-size: 2.5rem; font-weight: 800; }
    .price-period { color: var(--text-muted); }
    .plan-desc { color: var(--text-secondary); margin-bottom: 20px; }
    .plan-features { list-style: none; text-align: left; margin-bottom: 24px; }
    .plan-features li { padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
    .plan-features li:last-child { border-bottom: none; }
  `]
})
export class SubscriptionComponent implements OnInit {
  plans: any[] = []; currentSub: any = null; currentPlan = 'FREE';
  loading = true; processing = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    Promise.all([
      this.api.getPlans().toPromise(),
      this.api.getCurrentSubscription().toPromise()
    ]).then(([plansRes, subRes]: any[]) => {
      if (plansRes?.success) this.plans = plansRes.data;
      if (subRes?.success) { this.currentSub = subRes.data; this.currentPlan = subRes.data.planType; }
      this.loading = false;
    }).catch(() => { this.loading = false; });
  }

  subscribe() {
    this.processing = true;
    this.api.createOrder().subscribe({
      next: (res) => {
        if (res.success) {
          const options = {
            key: res.data.razorpayKeyId,
            amount: res.data.amount,
            currency: res.data.currency,
            name: 'StudyAI Platform',
            description: 'Pro Plan - Monthly',
            order_id: res.data.orderId,
            handler: (response: any) => {
              this.api.verifyPayment({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature
              }).subscribe({
                next: (vRes) => {
                  if (vRes.success) {
                    this.currentSub = vRes.data; this.currentPlan = 'PRO';
                    alert('🎉 Pro subscription activated!');
                  }
                  this.processing = false;
                },
                error: () => { this.processing = false; }
              });
            },
            modal: { ondismiss: () => { this.processing = false; } },
            theme: { color: '#6366f1' }
          };
          const rzp = new Razorpay(options);
          rzp.open();
        }
      },
      error: () => { this.processing = false; }
    });
  }
}
