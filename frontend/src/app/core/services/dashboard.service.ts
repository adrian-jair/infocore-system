import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/analytics';

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<ApiResponse<DashboardSummary>>(`${this.API_URL}/dashboard`).pipe(
      map(res => res.data)
    );
  }

  downloadSummaryCsv(): void {
    window.open(`${this.API_URL}/export/csv-summary`, '_blank');
  }

  downloadFullCsv(): void {
    window.open(`${this.API_URL}/export/csv-full`, '_blank');
  }

  downloadExcel(): void {
    window.open(`${this.API_URL}/export/excel`, '_blank');
  }
}
