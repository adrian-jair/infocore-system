import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { AuditLog, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8080/api';

  getUsers(): Observable<User[]> {
    return this.http.get<ApiResponse<User[]>>(`${this.API_URL}/users`).pipe(
      map(res => res.data)
    );
  }

  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<ApiResponse<AuditLog[]>>(`${this.API_URL}/audit`).pipe(
      map(res => res.data)
    );
  }
}
