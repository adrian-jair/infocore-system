import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  logout(): void {
    this.authService.logout();
  }

  switchUser(email: string): void {
    this.authService.login(email, 'BSC2026!').subscribe(() => {
      window.location.reload();
    });
  }
}
