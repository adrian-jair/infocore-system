import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response.model';
import { LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly API_URL = 'http://localhost:8080/api/auth';

  private readonly TOKEN_KEY = 'bsc_auth_token';
  private readonly USER_KEY = 'bsc_auth_user';

  // Angular Signals para gestión de estado reactivo
  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<User | null>(this.getStoredUser());

  readonly isAuthenticated = computed(() => !!this.token() && !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ROLE_ADMIN');
  readonly isGerenteOrAdmin = computed(() => {
    const role = this.currentUser()?.role;
    return role === 'ROLE_ADMIN' || role === 'ROLE_GERENTE';
  });

  constructor() {
    // Si no hay usuario en sesión, iniciar sesión por defecto con la cuenta Administrador Demo
    if (!this.isAuthenticated()) {
      this.autoLoginDemoAdmin();
    }
  }

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(`${this.API_URL}/login`, { email, password }).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.setSession(res.data.token, res.data.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.token.set(token);
    this.currentUser.set(user);
  }

  private autoLoginDemoAdmin(): void {
    this.login('admin@demo.com', 'BSC2026!').subscribe({
      error: () => console.warn('Backend aún no disponible para auto-login de demo.')
    });
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
