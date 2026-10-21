import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Kpi, KpiMeasurement, TrafficLightStatus } from '../models/kpi.model';
import { PerspectiveType } from '../models/strategy.model';

@Injectable({
  providedIn: 'root'
})
export class KpiService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/kpis';

  getKpis(perspective?: PerspectiveType, status?: TrafficLightStatus): Observable<Kpi[]> {
    let params = new HttpParams();
    if (perspective) params = params.set('perspective', perspective);
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<Kpi[]>>(this.API_URL, { params }).pipe(
      map(res => res.data)
    );
  }

  getKpiById(id: string): Observable<Kpi> {
    return this.http.get<ApiResponse<Kpi>>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  createKpi(kpi: Partial<Kpi>): Observable<Kpi> {
    return this.http.post<ApiResponse<Kpi>>(this.API_URL, kpi).pipe(
      map(res => res.data)
    );
  }

  updateKpi(id: string, kpi: Partial<Kpi>): Observable<Kpi> {
    return this.http.put<ApiResponse<Kpi>>(`${this.API_URL}/${id}`, kpi).pipe(
      map(res => res.data)
    );
  }

  deleteKpi(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(() => void 0)
    );
  }

  getMeasurements(kpiId: string): Observable<KpiMeasurement[]> {
    return this.http.get<ApiResponse<KpiMeasurement[]>>(`${this.API_URL}/${kpiId}/measurements`).pipe(
      map(res => res.data)
    );
  }

  recordMeasurement(kpiId: string, measurement: Partial<KpiMeasurement>): Observable<KpiMeasurement> {
    return this.http.post<ApiResponse<KpiMeasurement>>(`${this.API_URL}/${kpiId}/measurements`, measurement).pipe(
      map(res => res.data)
    );
  }
}
