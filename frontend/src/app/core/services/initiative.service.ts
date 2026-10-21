import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { StrategicInitiative } from '../models/initiative.model';

@Injectable({
  providedIn: 'root'
})
export class InitiativeService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api/initiatives';

  getAll(): Observable<StrategicInitiative[]> {
    return this.http.get<ApiResponse<StrategicInitiative[]>>(this.API_URL).pipe(
      map(res => res.data)
    );
  }

  getById(id: string): Observable<StrategicInitiative> {
    return this.http.get<ApiResponse<StrategicInitiative>>(`${this.API_URL}/${id}`).pipe(
      map(res => res.data)
    );
  }

  create(initiative: Partial<StrategicInitiative>): Observable<StrategicInitiative> {
    return this.http.post<ApiResponse<StrategicInitiative>>(this.API_URL, initiative).pipe(
      map(res => res.data)
    );
  }

  update(id: string, initiative: Partial<StrategicInitiative>): Observable<StrategicInitiative> {
    return this.http.put<ApiResponse<StrategicInitiative>>(`${this.API_URL}/${id}`, initiative).pipe(
      map(res => res.data)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
