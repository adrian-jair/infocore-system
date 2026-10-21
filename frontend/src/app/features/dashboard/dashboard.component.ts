import { Component, OnInit, inject, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardSummary } from '../../core/models/dashboard.model';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <!-- Encabezado de Página -->
      <div class="page-header">
        <div>
          <h1>Dashboard Ejecutivo BSC 2025</h1>
          <p class="text-muted">TechPeru SAC · Balanced Scorecard Integral · Período Ene - Jun 2025</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-secondary btn-sm" (click)="loadDashboard()">
            <span>🔄</span> Actualizar Datos
          </button>
          <button class="btn btn-primary btn-sm" (click)="dashboardService.downloadSummaryCsv()">
            <span>📥</span> Exportar CSV (resumen_bsc.csv)
          </button>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Consolidando métricas del Balanced Scorecard...</p>
        </div>
      } @else if (summary()) {
        <!-- Tarjetas Métricas Principales (KPI Cards) -->
        <div class="metrics-grid">
          <!-- Tarjeta 1: Cumplimiento Global -->
          <div class="card metric-card highlight">
            <div class="metric-top">
              <span class="metric-label">ÍNDICE GLOBAL DE CUMPLIMIENTO</span>
              <span class="badge-status" [ngClass]="summary()!.globalStatus.toLowerCase().replace('_', '-')">
                ⚠ {{ summary()!.globalStatus.replace('_', ' ') }}
              </span>
            </div>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ summary()!.globalCompliance | number:'1.1-1' }}%</span>
              <span class="metric-sub">Promedio exacto de los 36 KPIs</span>
            </div>
            <div class="progress-bar-bg mt-2">
              <div class="progress-bar-fill" [style.width.%]="summary()!.globalCompliance"
                   [style.background-color]="'#d97706'"></div>
            </div>
          </div>

          <!-- Tarjeta 2: Objetivos Estratégicos -->
          <div class="card metric-card">
            <div class="metric-top">
              <span class="metric-label">OBJETIVOS ESTRATÉGICOS</span>
              <span class="metric-icon">🎯</span>
            </div>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ summary()!.totalObjectives }}</span>
              <span class="metric-sub">3 objetivos por cada perspectiva</span>
            </div>
            <div class="card-footer-info">
              <span>100% activos con alineación causa-efecto</span>
            </div>
          </div>

          <!-- Tarjeta 3: Semáforo de Indicadores KPI -->
          <div class="card metric-card">
            <div class="metric-top">
              <span class="metric-label">CATÁLOGO DE KPIS (36)</span>
              <span class="metric-icon">📊</span>
            </div>
            <div class="status-summary-pills">
              <div class="pill-stat good">
                <span class="pill-num">{{ summary()!.goodKpisCount }}</span>
                <span class="pill-lbl">Logrados</span>
              </div>
              <div class="pill-stat warn">
                <span class="pill-num">{{ summary()!.warnKpisCount }}</span>
                <span class="pill-lbl">En riesgo</span>
              </div>
              <div class="pill-stat bad">
                <span class="pill-num">{{ summary()!.badKpisCount }}</span>
                <span class="pill-lbl">Críticos</span>
              </div>
            </div>
            <div class="card-footer-info">
              <span>9 indicadores por perspectiva</span>
            </div>
          </div>

          <!-- Tarjeta 4: Portafolio de Iniciativas -->
          <div class="card metric-card">
            <div class="metric-top">
              <span class="metric-label">INICIATIVAS ESTRATÉGICAS</span>
              <span class="metric-icon">🚀</span>
            </div>
            <div class="metric-value-wrap">
              <span class="metric-value">{{ summary()!.totalInitiatives }}</span>
              <span class="metric-sub">Presupuesto total S/ {{ summary()!.totalBudget | number:'1.0-0' }}</span>
            </div>
            <div class="card-footer-info">
              <span>Avance promedio: <strong>{{ summary()!.averageProgress | number:'1.0-0' }}%</strong></span>
            </div>
          </div>
        </div>

        <!-- Fila de Gráficos Analíticos -->
        <div class="charts-grid">
          <div class="card chart-card">
            <div class="chart-header">
              <h3>Desempeño por Perspectiva del BSC</h3>
              <span class="text-muted text-xs">Cumplimiento promedio ponderado (%)</span>
            </div>
            <div class="chart-container">
              <canvas #perspectiveCanvas></canvas>
            </div>
          </div>

          <div class="card chart-card">
            <div class="chart-header">
              <h3>Tendencia Mensual de Cumplimiento 2025</h3>
              <span class="text-muted text-xs">Evolución Enero - Junio (Meta: 90%)</span>
            </div>
            <div class="chart-container">
              <canvas #trendCanvas></canvas>
            </div>
          </div>
        </div>

        <!-- Matriz Ejecutiva en 4 Cuadrantes (Reproducción exacta del Dashboard oficial) -->
        <div class="matrix-section">
          <div class="section-title-wrap">
            <h2>Matriz Ejecutiva de Control en 4 Cuadrantes</h2>
            <p class="text-muted">Consolidación simultánea de los 36 indicadores KPI clasificados por perspectiva</p>
          </div>

          <div class="quadrants-grid">
            @for (p of summary()!.perspectives; track p.code) {
              <div class="card quadrant-card" [style.border-top-color]="p.color">
                <div class="quadrant-header" [style.background-color]="p.softColor">
                  <div class="quadrant-title">
                    <span class="quadrant-icon">{{ p.icon }}</span>
                    <h4>Perspectiva {{ p.label }}</h4>
                  </div>
                  <div class="quadrant-score">
                    <span class="score-pct" [style.color]="p.color">{{ p.compliance | number:'1.1-1' }}%</span>
                  </div>
                </div>

                <div class="quadrant-stats-bar">
                  <span class="q-tag good">✅ {{ p.goodCount }} Logrados</span>
                  <span class="q-tag warn">⚠ {{ p.warnCount }} En riesgo</span>
                  <span class="q-tag bad">❌ {{ p.badCount }} Críticos</span>
                </div>

                <div class="quadrant-body">
                  <p class="text-xs text-muted">Contiene 3 objetivos estratégicos y 9 indicadores KPI oficiales.</p>
                  <a [routerLink]="['/bsc-completo']" [queryParams]="{ perspective: p.perspective }" class="btn btn-outline-primary btn-sm mt-3">
                    Explorar KPIs de {{ p.label }} →
                  </a>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Indicadores Críticos Prioritarios -->
        <div class="critical-section card mt-4">
          <div class="section-header">
            <div>
              <h3>⚠️ Indicadores Críticos con Acción Recomendada</h3>
              <p class="text-muted text-xs">KPIs con cumplimiento menor al 75% que requieren intervención estratégica inmediata</p>
            </div>
            <span class="badge-status critico">{{ summary()!.criticalKpis.length }} KPIs Críticos</span>
          </div>

          <div class="table-container mt-3">
            <table class="table-corp">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Indicador KPI</th>
                  <th>Perspectiva</th>
                  <th>Meta</th>
                  <th>Real</th>
                  <th>Cumplimiento</th>
                  <th>Estado</th>
                  <th>Acción Estratégica Inmediata</th>
                </tr>
              </thead>
              <tbody>
                @for (kpi of summary()!.criticalKpis; track kpi.id) {
                  <tr>
                    <td><strong>{{ kpi.id }}</strong></td>
                    <td>{{ kpi.name }}</td>
                    <td><span class="badge-persp">{{ kpi.perspective }}</span></td>
                    <td>{{ kpi.target }} {{ kpi.unit }}</td>
                    <td><strong class="text-danger">{{ kpi.current }} {{ kpi.unit }}</strong></td>
                    <td><strong>{{ kpi.compliance | number:'1.1-1' }}%</strong></td>
                    <td><span class="badge-status critico">❌ CRÍTICO</span></td>
                    <td class="text-sm font-medium">{{ kpi.recommendation }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .metric-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .metric-card.highlight {
      border-left: 4px solid var(--status-warn-solid);
    }
    .metric-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .metric-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }
    .metric-icon {
      font-size: 1.25rem;
    }
    .metric-value-wrap {
      margin: 0.75rem 0;
    }
    .metric-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary);
      display: block;
      line-height: 1.1;
    }
    .metric-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .card-footer-info {
      font-size: 0.75rem;
      color: var(--text-secondary);
      border-top: 1px solid var(--border-color);
      padding-top: 0.5rem;
      margin-top: 0.5rem;
    }
    .status-summary-pills {
      display: flex;
      gap: 0.5rem;
      margin: 0.75rem 0;
    }
    .pill-stat {
      flex: 1;
      text-align: center;
      padding: 0.4rem 0.2rem;
      border-radius: 0.5rem;
    }
    .pill-stat.good { background: var(--status-good-bg); color: var(--status-good-text); }
    .pill-stat.warn { background: var(--status-warn-bg); color: var(--status-warn-text); }
    .pill-stat.bad { background: var(--status-bad-bg); color: var(--status-bad-text); }
    .pill-num { font-size: 1.1rem; font-weight: 700; display: block; }
    .pill-lbl { font-size: 0.65rem; text-transform: uppercase; font-weight: 600; }
    
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
      gap: 1.25rem;
      margin-bottom: 2rem;
    }
    .chart-card {
      height: 340px;
      display: flex;
      flex-direction: column;
    }
    .chart-header {
      margin-bottom: 0.75rem;
    }
    .chart-container {
      position: relative;
      flex: 1;
      width: 100%;
    }
    .matrix-section {
      margin-bottom: 2rem;
    }
    .section-title-wrap {
      margin-bottom: 1rem;
    }
    .quadrants-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
    }
    .quadrant-card {
      border-top: 4px solid var(--accent);
      padding: 0;
      overflow: hidden;
    }
    .quadrant-header {
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }
    .quadrant-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .score-pct {
      font-size: 1.35rem;
      font-weight: 800;
    }
    .quadrant-stats-bar {
      display: flex;
      justify-content: space-between;
      padding: 0.65rem 1.25rem;
      background: #f8fafc;
      border-bottom: 1px solid var(--border-color);
      font-size: 0.75rem;
      font-weight: 600;
    }
    .quadrant-body {
      padding: 1.25rem;
    }
    .badge-persp {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      background: #f1f5f9;
      color: #334155;
    }
    .text-xs { font-size: 0.75rem; }
    .loading-state {
      text-align: center;
      padding: 4rem 1rem;
      color: var(--text-muted);
    }
    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #e2e8f0;
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  readonly dashboardService = inject(DashboardService);

  readonly loading = signal<boolean>(true);
  readonly summary = signal<DashboardSummary | null>(null);

  @ViewChild('perspectiveCanvas') perspectiveCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('trendCanvas') trendCanvas?: ElementRef<HTMLCanvasElement>;

  private perspectiveChart?: Chart;
  private trendChart?: Chart;

  ngOnInit(): void {
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    if (this.summary()) {
      this.renderCharts(this.summary()!);
    }
  }

  loadDashboard(): void {
    this.loading.set(true);
    this.dashboardService.getSummary().subscribe({
      next: data => {
        this.summary.set(data);
        this.loading.set(false);
        setTimeout(() => this.renderCharts(data), 50);
      },
      error: err => {
        console.error('Error al cargar dashboard:', err);
        this.loading.set(false);
      }
    });
  }

  private renderCharts(data: DashboardSummary): void {
    if (this.perspectiveCanvas?.nativeElement) {
      if (this.perspectiveChart) this.perspectiveChart.destroy();
      const ctx = this.perspectiveCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.perspectiveChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: data.perspectives.map(p => p.label),
            datasets: [{
              label: 'Cumplimiento (%)',
              data: data.perspectives.map(p => p.compliance || 0),
              backgroundColor: ['#1d4ed8', '#0d9488', '#d97706', '#7c3aed'],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                ticks: { callback: v => v + '%' }
              }
            }
          }
        });
      }
    }

    if (this.trendCanvas?.nativeElement) {
      if (this.trendChart) this.trendChart.destroy();
      const ctx = this.trendCanvas.nativeElement.getContext('2d');
      if (ctx) {
        this.trendChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.monthlyTrends.map(m => m.label),
            datasets: [
              {
                label: 'Cumplimiento Real (%)',
                data: data.monthlyTrends.map(m => m.compliance),
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.3,
                pointRadius: 5
              },
              {
                label: 'Meta Óptima (90%)',
                data: [90, 90, 90, 90, 90, 90],
                borderColor: '#16a34a',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 60,
                max: 100,
                ticks: { callback: v => v + '%' }
              }
            }
          }
        });
      }
    }
  }
}
