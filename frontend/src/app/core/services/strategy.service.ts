import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { Perspective, PerspectiveType, StrategicObjective, StrategyLink } from '../models/strategy.model';

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/strategy';

  getPerspectives(): Observable<Perspective[]> {
    return this.http.get<ApiResponse<Perspective[]>>(`${this.API_URL}/perspectives`).pipe(
      map(res => res.data)
    );
  }

  getObjectives(perspective?: PerspectiveType): Observable<StrategicObjective[]> {
    let params = new HttpParams();
    if (perspective) params = params.set('perspective', perspective);

    return this.http.get<ApiResponse<StrategicObjective[]>>(`${this.API_URL}/objectives`, { params }).pipe(
      map(res => res.data)
    );
  }

  getObjectiveById(id: string): Observable<StrategicObjective> {
    return this.http.get<ApiResponse<StrategicObjective>>(`${this.API_URL}/objectives/${id}`).pipe(
      map(res => res.data)
    );
  }

  createObjective(objective: Partial<StrategicObjective>): Observable<StrategicObjective> {
    return this.http.post<ApiResponse<StrategicObjective>>(`${this.API_URL}/objectives`, objective).pipe(
      map(res => res.data)
    );
  }

  updateObjective(id: string, objective: Partial<StrategicObjective>): Observable<StrategicObjective> {
    return this.http.put<ApiResponse<StrategicObjective>>(`${this.API_URL}/objectives/${id}`, objective).pipe(
      map(res => res.data)
    );
  }

  deleteObjective(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/objectives/${id}`).pipe(
      map(() => void 0)
    );
  }

  getStrategyLinks(): Observable<StrategyLink[]> {
    return this.http.get<ApiResponse<StrategyLink[]>>(`${this.API_URL}/links`).pipe(
      map(res => res.data)
    );
  }
}
