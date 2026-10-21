import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { KpiService } from '../../core/services/kpi.service';
import { AuthService } from '../../core/services/auth.service';
import { Kpi, KpiMeasurement } from '../../core/models/kpi.model';

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="measurements-page">
      <div class="page-header">
        <div>
          <h1>Registro de Mediciones y Resultados</h1>
          <p class="text-muted">Actualización periódica de datos reales. El semáforo y cumplimiento se recalculan en tiempo real.</p>
        </div>
      </div>

      <div class="measurements-grid">
        <!-- Formulario de Registro -->
        <div class="card form-card">
          <h3>Ingresar Nueva Medición</h3>
          <p class="text-xs text-muted mb-3">Publica un evento de dominio Modulith para actualizar el estado estratégico.</p>

          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label class="form-label">Seleccionar Indicador KPI *</label>
              <select formControlName="kpiId" class="form-select" (change)="onKpiSelected()">
                <option value="">-- Seleccione un indicador --</option>
                @for (kpi of kpis(); track kpi.id) {
                  <option [value]="kpi.id">
                    [{{ kpi.id }}] {{ kpi.name }} (Meta: {{ kpi.target }} {{ kpi.unit }})
                  </option>
                }
              </select>
            </div>

            @if (currentKpi()) {
              <div class="kpi-info-box mb-3">
                <div class="kpi-info-row">
                  <span>Meta Anual: <strong>{{ currentKpi()!.target }} {{ currentKpi()!.unit }}</strong></span>
                  <span>Valor Actual: <strong>{{ currentKpi()!.current }} {{ currentKpi()!.unit }}</strong></span>
                </div>
                <div class="kpi-info-row mt-1">
                  <span>Sentido: <strong>{{ currentKpi()!.direction === 'MAYOR_MEJOR' ? '↑ Mayor es mejor' : '↓ Menor es mejor' }}</strong></span>
                  <span class="badge-status" [ngClass]="currentKpi()!.status.toLowerCase().replace('_', '-')">
                    {{ currentKpi()!.compliance | number:'1.1-1' }}%
                  </span>
                </div>
              </div>
            }

            <div class="row-2">
              <div class="form-group">
                <label class="form-label">Período de Evaluación *</label>
                <input type="month" formControlName="period" class="form-control" />
              </div>

              <div class="form-group">
                <label class="form-label">Valor Real Medido *</label>
                <input type="number" step="0.01" formControlName="value" class="form-control" placeholder="0.00" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Responsable del Registro *</label>
              <input type="text" formControlName="responsible" class="form-control" />
            </div>

            <div class="form-group">
              <label class="form-label">Notas u Observaciones del Cierre</label>
              <textarea formControlName="notes" class="form-control" rows="2" placeholder="Detalle de causas o justificación..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="form.invalid || submitting()">
              {{ submitting() ? 'Procesando...' : '💾 Guardar Medición y Recalcular' }}
            </button>
          </form>

          @if (feedback()) {
            <div class="alert-success mt-3">
              <span>✅</span> {{ feedback() }}
            </div>
          }
        </div>

        <!-- Historial Reciente del KPI Seleccionado -->
        <div class="card history-card">
          <div class="history-header">
            <h3>Historial de Mediciones</h3>
            @if (currentKpi()) {
              <span class="badge-kpi">{{ currentKpi()!.id }}</span>
            }
          </div>

          @if (!currentKpi()) {
            <div class="empty-history">
              <p>Selecciona un indicador KPI para visualizar su histórico mensual.</p>
            </div>
          } @else if (measurements().length === 0) {
            <div class="empty-history">
              <p>No existen registros históricos para este indicador.</p>
            </div>
          } @else {
            <div class="table-container mt-2">
              <table class="table-corp">
                <thead>
                  <tr>
                    <th>Período</th>
                    <th>Fecha</th>
                    <th>Valor Registrado</th>
                    <th>Responsable</th>
                    <th>Notas</th>
                  </tr>
                </thead>
                <tbody>
                  @for (m of measurements(); track m.id) {
                    <tr>
                      <td><strong>{{ m.period }}</strong></td>
                      <td>{{ m.date }}</td>
                      <td><strong>{{ m.value }} {{ currentKpi()!.unit }}</strong></td>
                      <td>{{ m.responsible }}</td>
                      <td class="text-xs">{{ m.notes }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .measurements-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .measurements-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 1.5rem;
    }
    .kpi-info-box {
      background: #f8fafc;
      border: 1px solid var(--border-color);
      border-radius: 0.5rem;
      padding: 0.75rem 1rem;
      font-size: 0.85rem;
    }
    .kpi-info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .btn-block {
      width: 100%;
      padding: 0.75rem;
      margin-top: 0.5rem;
    }
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;
    }
    .badge-kpi {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent);
      background: #eff6ff;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    .empty-history {
      padding: 3rem 1rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .alert-success {
      background: var(--status-good-bg);
      color: var(--status-good-text);
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class MeasurementsComponent implements OnInit {
  private readonly kpiService = inject(KpiService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly kpis = signal<Kpi[]>([]);
  readonly currentKpi = signal<Kpi | null>(null);
  readonly measurements = signal<KpiMeasurement[]>([]);
  readonly submitting = signal<boolean>(false);
  readonly feedback = signal<string>('');

  readonly form = this.fb.group({
    kpiId: ['', Validators.required],
    period: ['2025-06', Validators.required],
    value: [null as number | null, Validators.required],
    responsible: [this.authService.currentUser()?.name || '', Validators.required],
    notes: ['']
  });

  ngOnInit(): void {
    this.kpiService.getKpis().subscribe(data => this.kpis.set(data));
  }

  onKpiSelected(): void {
    const kpiId = this.form.get('kpiId')?.value;
    if (!kpiId) {
      this.currentKpi.set(null);
      this.measurements.set([]);
      return;
    }

    const kpi = this.kpis().find(k => k.id === kpiId) || null;
    this.currentKpi.set(kpi);

    if (kpi) {
      this.kpiService.getMeasurements(kpi.id).subscribe(ms => this.measurements.set(ms));
      this.form.patchValue({
        responsible: this.authService.currentUser()?.name || kpi.owner
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.feedback.set('');

    const val = this.form.value;
    const measurement: Partial<KpiMeasurement> = {
      period: val.period!,
      value: Number(val.value),
      responsible: val.responsible!,
      notes: val.notes || 'Registro manual de resultados'
    };

    this.kpiService.recordMeasurement(val.kpiId!, measurement).subscribe({
      next: saved => {
        this.submitting.set(false);
        this.feedback.set(`Medición para ${saved.period} guardada exitosamente. Cumplimiento actualizado.`);
        // Recargar datos
        this.kpiService.getKpiById(val.kpiId!).subscribe(updated => {
          this.currentKpi.set(updated);
        });
        this.kpiService.getMeasurements(val.kpiId!).subscribe(ms => {
          this.measurements.set(ms);
        });
      },
      error: err => {
        this.submitting.set(false);
        alert('Error al registrar medición: ' + (err.error?.message || err.message));
      }
    });
  }
}
