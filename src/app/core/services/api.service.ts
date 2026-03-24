import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Study Plans
  createStudyPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/study-plans`, data);
  }
  getActivePlan(): Observable<any> {
    return this.http.get(`${this.apiUrl}/study-plans/active`);
  }
  getAllPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/study-plans`);
  }
  markEntryComplete(entryId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/study-plans/entries/${entryId}/complete`, {});
  }

  // Mock Tests
  createMockTest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mock-tests`, data);
  }
  getTest(testId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mock-tests/${testId}`);
  }
  submitTest(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mock-tests/submit`, data);
  }
  getUserTests(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mock-tests`);
  }

  // Dashboard
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`);
  }
  getRankPrediction(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/rank-prediction`);
  }

  // Subjects
  getSubjects(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subjects`);
  }
  getSubjectsByExam(examType: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/subjects/by-exam/${examType}`);
  }

  // Subscription
  getPlans(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subscription/plans`);
  }
  createOrder(): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscription/create-order`, {});
  }
  verifyPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/subscription/verify-payment`, data);
  }
  getCurrentSubscription(): Observable<any> {
    return this.http.get(`${this.apiUrl}/subscription/current`);
  }
}
