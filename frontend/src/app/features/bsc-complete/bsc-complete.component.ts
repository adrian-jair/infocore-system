import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KpiService } from '../../core/services/kpi.service';
import { Kpi, TrafficLightStatus } from '../../core/models/kpi.model';
import { PerspectiveType } from '../../core/models/strategy.model';

@Component({
  selector: 'app-bsc-complete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bsc-complete-page">
      <div class="page-header">
        <div>
          <h1>Cuadro de Mando Completo (36 KPIs)</h1>
          <p class="text-muted">Catálogo detallado de indicadores con metas, resultados acumulados y semáforos</p>
        </div>
      </div>

      <!-- Barra de Filtros -->
      <div class="card filters-card mb-4">
        <div class="filters-row">
          <div class="filter-item search-box">
            <label class="form-label">Buscar Indicador</label>
            <input type="text" [(ngModel)]="searchTerm" placeholder="Buscar por código, nombre o responsable..." class="form-control" />
          </div>

          <div class="filter-item">
            <label class="form-label">Perspectiva</label>
            <select [(ngModel)]="selectedPerspective" class="form-select">
              <option value="">Todas las perspectivas</option>
              <option value="FINANCIERA">💰 Financiera (9 KPIs)</option>
              <option value="CLIENTES">👥 Clientes (9 KPIs)</option>
              <option value="PROCESOS">🔧 Procesos Internos (9 KPIs)</option>
              <option value="APRENDIZAJE">📚 Aprendizaje y Crecimiento (9 KPIs)</option>
            </select>
          </div>

          <div class="filter-item">
            <label class="form-label">Semáforo</label>
            <select [(ngModel)]="selectedStatus" class="form-select">
              <option value="">Todos los estados</option>
              <option value="LOGRADO">✅ Logrado (≥ 90%)</option>
              <option value="EN_RIESGO">⚠ En riesgo (75% - 89.9%)</option>
              <option value="CRITICO">❌ Crítico (< 75%)</option>
            </select>
          </div>

          <div class="filter-reset">
            <button class="btn btn-secondary btn-sm" (click)="resetFilters()">Limpiar Filtros</button>
          </div>
        </div>
      </div>

      <!-- Resumen de resultados filtrados -->
      <div class="results-info">
        <span>Mostrando <strong>{{ filteredKpis().length }}</strong> de 36 indicadores</span>
      </div>

      <!-- Tabla de Indicadores -->
      <div class="card p-0 table-container">
        <table class="table-corp">
          <thead>
            <tr>
              <th>Código</th>
              <th>Indicador KPI</th>
              <th>Perspectiva</th>
              <th>Objetivo</th>
              <th>Línea Base</th>
              <th>Meta</th>
              <th>Real Acum.</th>
              <th>Sentido</th>
              <th>% Cumpl.</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (kpi of filteredKpis(); track kpi.id) {
              <tr>
                <td><strong>{{ kpi.id }}</strong></td>
                <td>
                  <div class="kpi-name-cell">
                    <span class="kpi-title">{{ kpi.name }}</span>
                    <span class="text-xs text-muted">{{ kpi.area }} · {{ kpi.owner }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge-perspective" [ngClass]="kpi.perspective.toLowerCase()">
                    {{ kpi.perspective }}
                  </span>
                </td>
                <td><small>{{ kpi.objectiveId }}</small></td>
                <td>{{ kpi.baseline }} {{ kpi.unit }}</td>
                <td><strong>{{ kpi.target }} {{ kpi.unit }}</strong></td>
                <td>{{ kpi.current }} {{ kpi.unit }}</td>
                <td>
                  <span class="text-xs" [title]="kpi.direction">
                    {{ kpi.direction === 'MAYOR_MEJOR' ? '↑ Mayor' : '↓ Menor' }}
                  </span>
                </td>
                <td>
                  <strong [ngClass]="getComplianceClass(kpi.compliance)">
                    {{ kpi.compliance | number:'1.1-1' }}%
                  </strong>
                </td>
                <td>
                  <span class="badge-status" [ngClass]="kpi.status.toLowerCase().replace('_', '-')">
                    {{ kpi.status === 'LOGRADO' ? '✅ Logrado' : (kpi.status === 'EN_RIESGO' ? '⚠ En riesgo' : '❌ Crítico') }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-secondary btn-sm" (click)="openDetail(kpi)">
                    Ficha Técnica
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal de Ficha Técnica -->
      @if (selectedKpi()) {
        <div class="modal-backdrop" (click)="closeDetail()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3>{{ selectedKpi()!.id }}: {{ selectedKpi()!.name }}</h3>
                <span class="text-xs text-muted">{{ selectedKpi()!.perspective }} · {{ selectedKpi()!.area }}</span>
              </div>
              <button class="btn-close" (click)="closeDetail()">✕</button>
            </div>

            <div class="modal-body">
              <div class="kpi-detail-grid">
                <div class="detail-item">
                  <span class="detail-lbl">Fórmula de Cálculo:</span>
                  <span class="detail-val font-mono">{{ selectedKpi()!.formula }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-lbl">Sentido de Medición:</span>
                  <span class="detail-val">{{ selectedKpi()!.direction === 'MAYOR_MEJOR' ? 'Mayor es mejor (Directo)' : 'Menor es mejor (Inverso)' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-lbl">Frecuencia de Medición:</span>
                  <span class="detail-val">{{ selectedKpi()!.frequency }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-lbl">Responsable:</span>
                  <span class="detail-val">{{ selectedKpi()!.owner }} ({{ selectedKpi()!.area }})</span>
                </div>
                <div class="detail-item">
                  <span class="detail-lbl">Meta Anual 2025:</span>
                  <span class="detail-val"><strong>{{ selectedKpi()!.target }} {{ selectedKpi()!.unit }}</strong></span>
                </div>
                <div class="detail-item">
                  <span class="detail-lbl">Real Acumulado Actual:</span>
                  <span class="detail-val"><strong>{{ selectedKpi()!.current }} {{ selectedKpi()!.unit }}</strong></span>
                </div>
                <div class="detail-item full">
                  <span class="detail-lbl">Análisis / Acción Recomendada:</span>
                  <div class="recommendation-box">{{ selectedKpi()!.recommendation }}</div>
                </div>
              </div>

              <!-- Histórico de Mediciones -->
              <h4 class="mt-4 mb-2">Historial Mensual 2025</h4>
              <div class="table-container">
                <table class="table-corp">
                  <thead>
                    <tr>
                      <th>Período</th>
                      <th>Fecha</th>
                      <th>Valor</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (m of measurements(); track m.id) {
                      <tr>
                        <td><strong>{{ m.period }}</strong></td>
                        <td>{{ m.date }}</td>
                        <td><strong>{{ m.value }} {{ selectedKpi()!.unit }}</strong></td>
                        <td class="text-xs">{{ m.notes }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeDetail()">Cerrar</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .bsc-complete-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .filters-row {
      display: flex;
      gap: 1rem;
      align-items: flex-end;
      flex-wrap: wrap;
    }
    .filter-item {
      flex: 1;
      min-width: 200px;
    }
    .filter-item.search-box {
      flex: 2;
      min-width: 280px;
    }
    .results-info {
      margin-bottom: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .kpi-name-cell {
      display: flex;
      flex-direction: column;
    }
    .kpi-title {
      font-weight: 600;
      color: var(--primary);
    }
    .badge-perspective {
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-perspective.financiera { background: #eff6ff; color: #1d4ed8; }
    .badge-perspective.clientes { background: #f0fdfa; color: #0d9488; }
    .badge-perspective.procesos { background: #fffbeb; color: #d97706; }
    .badge-perspective.aprendizaje { background: #f5f3ff; color: #7c3aed; }
    
    .text-good { color: var(--status-good-text); font-weight: 700; }
    .text-warn { color: var(--status-warn-text); font-weight: 700; }
    .text-bad { color: var(--status-bad-text); font-weight: 700; }

    .kpi-detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .detail-item.full {
      grid-column: span 2;
    }
    .detail-lbl {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .recommendation-box {
      background: #fffbeb;
      border-left: 3px solid #d97706;
      padding: 0.75rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.85rem;
      color: #78350f;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #64748b;
    }
    .font-mono { font-family: monospace; }
  `]
})
export class BscCompleteComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  private readonly route = inject(ActivatedRoute);

  readonly kpis = signal<Kpi[]>([]);
  readonly selectedKpi = signal<Kpi | null>(null);
  readonly measurements = signal<any[]>([]);

  searchTerm: string = '';
  selectedPerspective: string = '';
  selectedStatus: string = '';

  readonly filteredKpis = computed(() => {
    let list = this.kpis();
    if (this.selectedPerspective) {
      list = list.filter(k => k.perspective === this.selectedPerspective);
    }
    if (this.selectedStatus) {
      list = list.filter(k => k.status === this.selectedStatus);
    }
    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(k =>
        k.id.toLowerCase().includes(q) ||
        k.name.toLowerCase().includes(q) ||
        k.owner.toLowerCase().includes(q) ||
        k.area.toLowerCase().includes(q)
      );
    }
    return list;
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['perspective']) {
        this.selectedPerspective = params['perspective'];
      }
      this.loadKpis();
    });
  }

  loadKpis(): void {
    this.kpiService.getKpis().subscribe(data => this.kpis.set(data));
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedPerspective = '';
    this.selectedStatus = '';
  }

  openDetail(kpi: Kpi): void {
    this.selectedKpi.set(kpi);
    this.kpiService.getMeasurements(kpi.id).subscribe(ms => this.measurements.set(ms));
  }

  closeDetail(): void {
    this.selectedKpi.set(null);
    this.measurements.set([]);
  }

  getComplianceClass(compliance: number | null): string {
    if (compliance === null) return '';
    if (compliance >= 90) return 'text-good';
    if (compliance >= 75) return 'text-warn';
    return 'text-bad';
  }
}
