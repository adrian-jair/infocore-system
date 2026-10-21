import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';
import { AuditLog, User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div>
          <h1>Administración del Sistema BSC</h1>
          <p class="text-muted">Gestión de identidades corporativas, perfiles de acceso y registro de auditoría</p>
        </div>
      </div>

      <!-- Información del Sistema -->
      <div class="card mb-4 system-info-card">
        <h3>Arquitectura y Configuración del Servidor</h3>
        <div class="info-badges-row mt-2">
          <div class="info-badge">
            <span class="info-k">Backend:</span>
            <span class="info-v">Java 21 · Spring Boot 3.3.4</span>
          </div>
          <div class="info-badge">
            <span class="info-k">Modular Monolith:</span>
            <span class="info-v">Spring Modulith 1.2.4 (Validado)</span>
          </div>
          <div class="info-badge">
            <span class="info-k">Base de Datos:</span>
            <span class="info-v">H2 (Dev) / PostgreSQL 16 (Prod)</span>
          </div>
          <div class="info-badge">
            <span class="info-k">Swagger UI:</span>
            <a href="http://localhost:8080/swagger-ui.html" target="_blank" class="info-link">/swagger-ui.html ↗</a>
          </div>
        </div>
      </div>

      <!-- Tablas: Usuarios y Auditoría -->
      <div class="admin-grid">
        <!-- Usuarios -->
        <div class="card">
          <div class="card-header-clean">
            <h3>Usuarios y Roles Autorizados (5)</h3>
            <span class="badge-status good">Activos</span>
          </div>
          <div class="table-container mt-2">
            <table class="table-corp">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Área</th>
                </tr>
              </thead>
              <tbody>
                @for (u of users(); track u.id) {
                  <tr>
                    <td><strong>{{ u.name }}</strong></td>
                    <td class="font-mono text-xs">{{ u.email }}</td>
                    <td>
                      <span class="role-pill" [ngClass]="u.role.toLowerCase()">
                        {{ u.roleDisplay }}
                      </span>
                    </td>
                    <td>{{ u.area }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Auditoría -->
        <div class="card">
          <div class="card-header-clean">
            <h3>Trazabilidad y Auditoría de Seguridad</h3>
            <span class="text-xs text-muted">Últimos eventos registrados</span>
          </div>
          <div class="table-container mt-2">
            <table class="table-corp">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                @for (log of auditLogs(); track log.id) {
                  <tr>
                    <td class="text-xs">{{ log.date | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td><strong>{{ log.user }}</strong></td>
                    <td><span class="action-tag">{{ log.action }}</span></td>
                    <td class="text-xs">{{ log.detail }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .system-info-card {
      background: #f8fafc;
      border-left: 4px solid var(--accent);
    }
    .info-badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .info-badge {
      background: #ffffff;
      padding: 0.5rem 0.85rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      font-size: 0.8rem;
    }
    .info-k {
      color: var(--text-muted);
      margin-right: 0.35rem;
      font-weight: 600;
    }
    .info-v {
      font-weight: 700;
      color: var(--primary);
    }
    .info-link {
      font-weight: 700;
      color: var(--accent);
      text-decoration: underline;
    }
    .admin-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    .card-header-clean {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
    }
    .role-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
    }
    .role-pill.role_admin { background: #fee2e2; color: #b91c1c; }
    .role-pill.role_gerente { background: #fef3c7; color: #b45309; }
    .role-pill.role_responsable { background: #eff6ff; color: #1d4ed8; }
    .action-tag {
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      padding: 0.15rem 0.45rem;
      border-radius: 0.25rem;
    }
    .font-mono { font-family: monospace; }
  `]
})
export class AdminComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);

  readonly users = signal<User[]>([]);
  readonly auditLogs = signal<AuditLog[]>([]);

  ngOnInit(): void {
    this.adminService.getUsers().subscribe(u => this.users.set(u));
    this.adminService.getAuditLogs().subscribe(a => this.auditLogs.set(a));
  }
}
