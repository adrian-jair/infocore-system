import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle">📊</div>
          <h2>Balanced Scorecard</h2>
          <p class="subtitle">TechPeru SAC · Período Estratégico 2025</p>
        </div>

        @if (errorMessage()) {
          <div class="alert-error">
            <span>⚠</span> {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Correo Electrónico</label>
            <input type="email" formControlName="email" class="form-control" placeholder="ejemplo@demo.com" />
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <small class="text-danger">Ingrese un correo válido</small>
            }
          </div>

          <div class="form-group">
            <label class="form-label">Contraseña</label>
            <input type="password" formControlName="password" class="form-control" placeholder="••••••••" />
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <small class="text-danger">La contraseña es obligatoria</small>
            }
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || loading()">
            {{ loading() ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <div class="demo-users-box">
          <div class="demo-title">Acceso rápido con cuentas de demostración:</div>
          <div class="demo-buttons">
            <button type="button" class="btn-demo" (click)="quickLogin('admin@demo.com', 'BSC2026!')">
              <span class="demo-role">Administrador</span>
              <span class="demo-email">admin&#64;demo.com</span>
            </button>
            <button type="button" class="btn-demo" (click)="quickLogin('gerente@demo.com', 'BSC2026!')">
              <span class="demo-role">Gerente Comercial</span>
              <span class="demo-email">gerente&#64;demo.com</span>
            </button>
            <button type="button" class="btn-demo" (click)="quickLogin('responsable@demo.com', 'BSC2026!')">
              <span class="demo-role">Responsable Operaciones</span>
              <span class="demo-email">responsable&#64;demo.com</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 1.5rem;
    }
    .login-card {
      background: #ffffff;
      border-radius: 1rem;
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .logo-circle {
      width: 3.5rem;
      height: 3.5rem;
      background: #eff6ff;
      border-radius: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.75rem;
      margin-bottom: 1rem;
      border: 1px solid #bfdbfe;
    }
    h2 {
      font-size: 1.5rem;
      color: #0f172a;
      margin-bottom: 0.25rem;
    }
    .subtitle {
      color: #64748b;
      font-size: 0.875rem;
    }
    .alert-error {
      background: #fee2e2;
      color: #b91c1c;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btn-block {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      margin-top: 0.5rem;
    }
    .text-danger {
      color: #ef4444;
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
    .demo-users-box {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }
    .demo-title {
      font-size: 0.75rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
      text-align: center;
    }
    .demo-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .btn-demo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.55rem 0.85rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: left;
    }
    .btn-demo:hover {
      background: #eff6ff;
      border-color: #93c5fd;
    }
    .demo-role {
      font-weight: 600;
      font-size: 0.8rem;
      color: #1e293b;
    }
    .demo-email {
      font-size: 0.75rem;
      color: #64748b;
    }
  `]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  readonly loginForm = this.fb.group({
    email: ['admin@demo.com', [Validators.required, Validators.email]],
    password: ['BSC2026!', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Error al autenticar con el servidor');
      }
    });
  }

  quickLogin(email: string, pass: string): void {
    this.loginForm.patchValue({ email, password: pass });
    this.onSubmit();
  }
}
