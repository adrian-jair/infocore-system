import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <div class="page-header no-print">
        <div>
          <h1>Centro de Reportes y Exportación</h1>
          <p class="text-muted">Descarga de informes ejecutivos en formatos CSV y Microsoft Excel (.xlsx), o impresión formateada</p>
        </div>
      </div>

      <!-- Opciones de Exportación -->
      <div class="export-cards-grid no-print mb-4">
        <div class="card export-card">
          <div class="export-icon">📄</div>
          <h3>Resumen Ejecutivo CSV</h3>
          <p class="text-xs text-muted">Archivo CSV delimitado por punto y coma (;) compatible con resumen_bsc.csv.</p>
          <button class="btn btn-primary btn-sm mt-3" (click)="dashboardService.downloadSummaryCsv()">
            📥 Descargar resumen_bsc.csv
          </button>
        </div>

        <div class="card export-card">
          <div class="export-icon">📊</div>
          <h3>BSC Completo (36 KPIs) CSV</h3>
          <p class="text-xs text-muted">Exporta los 36 indicadores con metas, línea base, responsables y semáforos.</p>
          <button class="btn btn-secondary btn-sm mt-3" (click)="dashboardService.downloadFullCsv()">
            📥 Descargar BSC CSV Completo
          </button>
        </div>

        <div class="card export-card">
          <div class="export-icon">📗</div>
          <h3>Libro Microsoft Excel (.xlsx)</h3>
          <p class="text-xs text-muted">Generado dinámicamente con Apache POI con estilos corporativos y fórmulas.</p>
          <button class="btn btn-primary btn-sm mt-3" (click)="dashboardService.downloadExcel()">
            📥 Descargar Excel (.xlsx)
          </button>
        </div>

        <div class="card export-card">
          <div class="export-icon">🖨️</div>
          <h3>Imprimir Informe PDF</h3>
          <p class="text-xs text-muted">Genera vista de impresión limpia y profesional lista para guardar en PDF.</p>
          <button class="btn btn-outline-primary btn-sm mt-3" (click)="printReport()">
            🖨️ Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      <!-- Vista previa del informe ejecutivo imprimible -->
      @if (summary()) {
        <div class="card printable-report">
          <div class="report-header">
            <div class="report-brand">
              <h2>INFORME EJECUTIVO DE GESTIÓN ESTRATÉGICA</h2>
              <h3>BALANCED SCORECARD — TECHPERU SAC</h3>
            </div>
            <div class="report-meta">
              <span><strong>Período:</strong> 2025 (Acumulado Ene-Jun)</span>
              <span><strong>Cumplimiento Global:</strong> {{ summary()!.globalCompliance | number:'1.2-2' }}%</span>
              <span><strong>Estado General:</strong> ⚠ EN RIESGO</span>
            </div>
          </div>

          <div class="report-summary-stats mt-3">
            <div class="stat-box">
              <span class="stat-title">4 PERSPECTIVAS</span>
              <span class="stat-detail">100% Cubiertas</span>
            </div>
            <div class="stat-box">
              <span class="stat-title">12 OBJETIVOS</span>
              <span class="stat-detail">Activos</span>
            </div>
            <div class="stat-box">
              <span class="stat-title">36 INDICADORES</span>
              <span class="stat-detail">11 Logrados · 19 Riesgo · 6 Críticos</span>
            </div>
            <div class="stat-box">
              <span class="stat-title">8 INICIATIVAS</span>
              <span class="stat-detail">S/ {{ summary()!.totalBudget | number:'1.0-0' }}</span>
            </div>
          </div>

          <h4 class="mt-4 mb-2">Desempeño por Perspectiva</h4>
          <table class="table-corp">
            <thead>
              <tr>
                <th>Perspectiva</th>
                <th>KPIs</th>
                <th>Cumplimiento</th>
                <th>✅ Logrados</th>
                <th>⚠ En riesgo</th>
                <th>❌ Críticos</th>
              </tr>
            </thead>
            <tbody>
              @for (p of summary()!.perspectives; track p.code) {
                <tr>
                  <td><strong>{{ p.icon }} {{ p.label }}</strong></td>
                  <td>{{ p.totalKpis }}</td>
                  <td><strong>{{ p.compliance | number:'1.1-1' }}%</strong></td>
                  <td>{{ p.goodCount }}</td>
                  <td>{{ p.warnCount }}</td>
                  <td>{{ p.badCount }}</td>
                </tr>
              }
            </tbody>
          </table>

          <h4 class="mt-4 mb-2">Indicadores que Requieren Intervención Urgente (Críticos)</h4>
          <table class="table-corp">
            <thead>
              <tr>
                <th>Código</th>
                <th>Indicador</th>
                <th>Meta</th>
                <th>Real</th>
                <th>% Cumpl.</th>
                <th>Acción Recomendada</th>
              </tr>
            </thead>
            <tbody>
              @for (kpi of summary()!.criticalKpis; track kpi.id) {
                <tr>
                  <td><strong>{{ kpi.id }}</strong></td>
                  <td>{{ kpi.name }}</td>
                  <td>{{ kpi.target }} {{ kpi.unit }}</td>
                  <td>{{ kpi.current }} {{ kpi.unit }}</td>
                  <td><strong>{{ kpi.compliance | number:'1.1-1' }}%</strong></td>
                  <td class="text-xs">{{ kpi.recommendation }}</td>
                </tr>
              }
            </tbody>
          </table>

          <div class="report-signatures mt-5">
            <div class="sign-block">
              <div class="sign-line"></div>
              <span>Ana Pérez</span>
              <small>Gerente General</small>
            </div>
            <div class="sign-block">
              <div class="sign-line"></div>
              <span>Carlos Ruiz</span>
              <small>Gerente Comercial</small>
            </div>
            <div class="sign-block">
              <div class="sign-line"></div>
              <span>María Torres</span>
              <small>Jefa de Operaciones</small>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .reports-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .export-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;
    }
    .export-card {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.5rem;
    }
    .export-icon {
      font-size: 2.25rem;
      margin-bottom: 0.5rem;
    }
    .printable-report {
      background: #ffffff;
      padding: 2.5rem;
      border: 1px solid var(--border-color);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .report-header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid var(--primary);
      padding-bottom: 1rem;
    }
    .report-brand h2 {
      font-size: 1.2rem;
      letter-spacing: 0.05em;
    }
    .report-brand h3 {
      font-size: 0.95rem;
      color: var(--accent);
    }
    .report-meta {
      display: flex;
      flex-direction: column;
      text-align: right;
      font-size: 0.85rem;
    }
    .report-summary-stats {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
    }
    .stat-box {
      text-align: center;
    }
    .stat-title {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      display: block;
    }
    .stat-detail {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--primary);
    }
    .report-signatures {
      display: flex;
      justify-content: space-around;
      margin-top: 3rem;
      padding-top: 1rem;
    }
    .sign-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 200px;
    }
    .sign-line {
      width: 100%;
      border-top: 1px solid #0f172a;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ReportsComponent implements OnInit {
  readonly dashboardService = inject(DashboardService);
  readonly summary = signal<DashboardSummary | null>(null);

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe(s => this.summary.set(s));
  }

  printReport(): void {
    window.print();
  }
}
