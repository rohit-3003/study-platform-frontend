import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'study-planner',
    canActivate: [authGuard],
    loadComponent: () => import('./features/study-planner/study-planner.component').then(m => m.StudyPlannerComponent)
  },
  {
    path: 'mock-tests',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mock-test/mock-test.component').then(m => m.MockTestComponent)
  },
  {
    path: 'mock-tests/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/mock-test/test-taking.component').then(m => m.TestTakingComponent)
  },
  {
    path: 'rank-predictor',
    canActivate: [authGuard],
    loadComponent: () => import('./features/rank-predictor/rank-predictor.component').then(m => m.RankPredictorComponent)
  },
  {
    path: 'subscription',
    canActivate: [authGuard],
    loadComponent: () => import('./features/subscription/subscription.component').then(m => m.SubscriptionComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];
