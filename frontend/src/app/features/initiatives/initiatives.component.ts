import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { InitiativeService } from '../../core/services/initiative.service';
import { AuthService } from '../../core/services/auth.service';
import { StrategicInitiative } from '../../core/models/initiative.model';

@Component({
  selector: 'app-initiatives',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="initiatives-page">
      <div class="page-header">
        <div>
          <h1>Portafolio de Iniciativas Estratégicas (8)</h1>
          <p class="text-muted">Proyectos clave orientados al cierre de brechas de los KPIs en riesgo y críticos</p>
        </div>
        @if (authService.isGerenteOrAdmin()) {
          <button class="btn btn-primary" (click)="openCreateModal()">
            <span>➕</span> Nueva Iniciativa
          </button>
        }
      </div>

      <!-- Resumen Métrico -->
      <div class="metrics-row mb-4">
        <div class="card metric-mini">
          <span class="lbl">TOTAL PROYECTOS</span>
          <span class="val">{{ initiatives().length }}</span>
        </div>
        <div class="card metric-mini">
          <span class="lbl">PRESUPUESTO ASIGNADO</span>
          <span class="val">S/ {{ totalBudget() | number:'1.0-0' }}</span>
        </div>
        <div class="card metric-mini">
          <span class="lbl">AVANCE PROMEDIO</span>
          <span class="val">{{ avgProgress() | number:'1.0-0' }}%</span>
        </div>
      </div>

      <!-- Tarjetas de Proyectos -->
      <div class="initiatives-grid">
        @for (init of initiatives(); track init.id) {
          <div class="card initiative-card">
            <div class="init-header">
              <span class="init-code">{{ init.id }}</span>
              <span class="badge-status" [ngClass]="getStatusClass(init.status)">
                {{ init.status }}
              </span>
            </div>

            <h3 class="init-name">{{ init.name }}</h3>
            <p class="init-desc">{{ init.description }}</p>

            <div class="init-progress-wrap">
              <div class="progress-labels">
                <span>Avance de Ejecución:</span>
                <strong>{{ init.progress }}%</strong>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" [style.width.%]="init.progress"
                     [style.background-color]="getProgressColor(init.progress)"></div>
              </div>
            </div>

            <div class="init-details">
              <div class="detail-row">
                <span>💰 Presupuesto:</span>
                <strong>S/ {{ init.budget | number:'1.0-0' }}</strong>
              </div>
              <div class="detail-row">
                <span>👤 Responsable:</span>
                <span>{{ init.owner }} ({{ init.area }})</span>
              </div>
              <div class="detail-row">
                <span>📅 Cronograma:</span>
                <span class="text-xs">{{ init.startDate }} al {{ init.endDate }}</span>
              </div>
              @if (init.kpiId) {
                <div class="detail-row highlight">
                  <span>🎯 Vinculado a:</span>
                  <strong>{{ init.kpiId }} · {{ init.objectiveId }}</strong>
                </div>
              }
            </div>

            @if (authService.isGerenteOrAdmin()) {
              <div class="init-actions">
                <button class="btn btn-secondary btn-sm" (click)="openEditModal(init)">Editar</button>
                @if (authService.isAdmin()) {
                  <button class="btn btn-danger btn-sm" (click)="deleteInit(init.id)">Eliminar</button>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Modal Crear / Editar Iniciativa -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingId() ? 'Editar Iniciativa Estratégica' : 'Nueva Iniciativa Estratégica' }}</h3>
              <button class="btn-close" (click)="closeModal()">✕</button>
            </div>

            <form [formGroup]="form" (ngSubmit)="saveInitiative()">
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Nombre del Proyecto / Acción *</label>
                  <input type="text" formControlName="name" class="form-control" />
                </div>

                <div class="form-group">
                  <label class="form-label">Descripción</label>
                  <textarea formControlName="description" class="form-control" rows="2"></textarea>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Objetivo Relacionado *</label>
                    <input type="text" formControlName="objectiveId" class="form-control" placeholder="OBJ-C1" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">KPI Asociado</label>
                    <input type="text" formControlName="kpiId" class="form-control" placeholder="KPI-C03" />
                  </div>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Responsable *</label>
                    <input type="text" formControlName="owner" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Área</label>
                    <input type="text" formControlName="area" class="form-control" />
                  </div>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Presupuesto (S/) *</label>
                    <input type="number" formControlName="budget" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Avance (%)</label>
                    <input type="number" formControlName="progress" class="form-control" min="0" max="100" />
                  </div>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Fecha Inicio</label>
                    <input type="date" formControlName="startDate" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Fecha Término</label>
                    <input type="date" formControlName="endDate" class="form-control" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Estado de la Iniciativa</label>
                  <select formControlName="status" class="form-select">
                    <option value="En ejecución">En ejecución</option>
                    <option value="En riesgo">En riesgo</option>
                    <option value="Completado">Completado</option>
                    <option value="Planificado">Planificado</option>
                  </select>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar Iniciativa</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .initiatives-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .metrics-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
    }
    .metric-mini {
      display: flex;
      flex-direction: column;
      padding: 1rem 1.25rem;
    }
    .metric-mini .lbl {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    .metric-mini .val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
    }
    .initiatives-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .initiative-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-top: 3px solid var(--accent);
    }
    .init-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .init-code {
      font-size: 0.75rem;
      font-weight: 800;
      color: var(--accent);
    }
    .init-name {
      font-size: 1.05rem;
      margin-bottom: 0.35rem;
      color: var(--primary);
    }
    .init-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
      line-height: 1.35;
    }
    .init-progress-wrap {
      background: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      margin-bottom: 1rem;
    }
    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      margin-bottom: 0.35rem;
    }
    .init-details {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.8rem;
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
      margin-bottom: 1rem;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
    }
    .detail-row.highlight {
      background: #eff6ff;
      padding: 0.35rem 0.5rem;
      border-radius: 0.25rem;
      color: #1e40af;
    }
    .init-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      border-top: 1px solid var(--border-color);
      padding-top: 0.75rem;
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
    }
  `]
})
export class InitiativesComponent implements OnInit {
  private readonly initiativeService = inject(InitiativeService);
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly initiatives = signal<StrategicInitiative[]>([]);
  readonly showModal = signal<boolean>(false);
  readonly editingId = signal<string | null>(null);

  readonly totalBudget = computed(() =>
    this.initiatives().reduce((sum, i) => sum + (i.budget || 0), 0)
  );

  readonly avgProgress = computed(() => {
    const list = this.initiatives();
    if (!list.length) return 0;
    return list.reduce((sum, i) => sum + (i.progress || 0), 0) / list.length;
  });

  readonly form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    objectiveId: ['', Validators.required],
    kpiId: [''],
    owner: ['', Validators.required],
    area: [''],
    budget: [0, [Validators.required, Validators.min(0)]],
    progress: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    startDate: ['2025-01-01'],
    endDate: ['2025-12-31'],
    status: ['En ejecución']
  });

  ngOnInit(): void {
    this.loadInitiatives();
  }

  loadInitiatives(): void {
    this.initiativeService.getAll().subscribe(data => this.initiatives.set(data));
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      description: '',
      objectiveId: 'OBJ-C1',
      kpiId: 'KPI-C03',
      owner: this.authService.currentUser()?.name || '',
      area: 'Operaciones',
      budget: 50000,
      progress: 0,
      startDate: '2025-01-15',
      endDate: '2025-08-30',
      status: 'En ejecución'
    });
    this.showModal.set(true);
  }

  openEditModal(init: StrategicInitiative): void {
    this.editingId.set(init.id);
    this.form.patchValue({
      name: init.name,
      description: init.description,
      objectiveId: init.objectiveId,
      kpiId: init.kpiId,
      owner: init.owner,
      area: init.area,
      budget: init.budget,
      progress: init.progress,
      startDate: init.startDate,
      endDate: init.endDate,
      status: init.status
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveInitiative(): void {
    if (this.form.invalid) return;

    const val = this.form.value as Partial<StrategicInitiative>;
    if (this.editingId()) {
      this.initiativeService.update(this.editingId()!, val).subscribe(() => {
        this.closeModal();
        this.loadInitiatives();
      });
    } else {
      this.initiativeService.create(val).subscribe(() => {
        this.closeModal();
        this.loadInitiatives();
      });
    }
  }

  deleteInit(id: string): void {
    if (confirm(`¿Estás seguro de eliminar la iniciativa ${id}?`)) {
      this.initiativeService.delete(id).subscribe(() => this.loadInitiatives());
    }
  }

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    if (s.includes('ejecución') || s.includes('completado')) return 'good';
    if (s.includes('riesgo')) return 'warn';
    return 'nodata';
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return '#16a34a';
    if (progress >= 50) return '#2563eb';
    return '#d97706';
  }
}
