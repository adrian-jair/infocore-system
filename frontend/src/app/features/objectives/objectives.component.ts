import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { StrategyService } from '../../core/services/strategy.service';
import { AuthService } from '../../core/services/auth.service';
import { PerspectiveType, StrategicObjective } from '../../core/models/strategy.model';

@Component({
  selector: 'app-objectives',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="objectives-page">
      <div class="page-header">
        <div>
          <h1>Gestión de Objetivos Estratégicos (12)</h1>
          <p class="text-muted">Metas y prioridades corporativas organizadas por las 4 perspectivas del BSC</p>
        </div>
        @if (authService.isGerenteOrAdmin()) {
          <button class="btn btn-primary" (click)="openCreateModal()">
            <span>➕</span> Nuevo Objetivo
          </button>
        }
      </div>

      <!-- Tabla de Objetivos -->
      <div class="card p-0 table-container">
        <table class="table-corp">
          <thead>
            <tr>
              <th>ID</th>
              <th>Objetivo Estratégico</th>
              <th>Perspectiva</th>
              <th>Responsable</th>
              <th>Prioridad</th>
              <th>Ponderación</th>
              <th>Estado</th>
              @if (authService.isGerenteOrAdmin()) {
                <th>Acciones</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (obj of objectives(); track obj.id) {
              <tr>
                <td><strong>{{ obj.id }}</strong></td>
                <td>
                  <div class="obj-info">
                    <span class="obj-name">{{ obj.name }}</span>
                    <span class="text-xs text-muted">{{ obj.description }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge-perspective" [ngClass]="obj.perspective.toLowerCase()">
                    {{ obj.perspective }}
                  </span>
                </td>
                <td>{{ obj.owner }}</td>
                <td>
                  <span class="priority-tag" [ngClass]="obj.priority.toLowerCase()">
                    {{ obj.priority }}
                  </span>
                </td>
                <td><strong>{{ obj.weight }}%</strong></td>
                <td>
                  <span class="status-pill active">{{ obj.status }}</span>
                </td>
                @if (authService.isGerenteOrAdmin()) {
                  <td>
                    <div class="actions-row">
                      <button class="btn btn-secondary btn-sm" (click)="openEditModal(obj)">Editar</button>
                      @if (authService.isAdmin()) {
                        <button class="btn btn-danger btn-sm" (click)="deleteObjective(obj.id)">Eliminar</button>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal Crear / Editar -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ editingId() ? 'Editar Objetivo Estratégico' : 'Nuevo Objetivo Estratégico' }}</h3>
              <button class="btn-close" (click)="closeModal()">✕</button>
            </div>

            <form [formGroup]="form" (ngSubmit)="saveObjective()">
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Nombre del Objetivo *</label>
                  <input type="text" formControlName="name" class="form-control" placeholder="Ej: Acelerar Transformación Digital" />
                </div>

                <div class="form-group">
                  <label class="form-label">Perspectiva BSC *</label>
                  <select formControlName="perspective" class="form-select">
                    <option value="FINANCIERA">Financiera</option>
                    <option value="CLIENTES">Clientes</option>
                    <option value="PROCESOS">Procesos Internos</option>
                    <option value="APRENDIZAJE">Aprendizaje y Crecimiento</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Descripción Detallada</label>
                  <textarea formControlName="description" class="form-control" rows="3"></textarea>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Responsable *</label>
                    <input type="text" formControlName="owner" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Prioridad</label>
                    <select formControlName="priority" class="form-select">
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div class="row-2">
                  <div class="form-group">
                    <label class="form-label">Ponderación (%) *</label>
                    <input type="number" formControlName="weight" class="form-control" min="1" max="100" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select formControlName="status" class="form-select">
                      <option value="Activo">Activo</option>
                      <option value="En revisión">En revisión</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancelar</button>
                <button type="submit" class="btn btn-primary" [disabled]="form.invalid">Guardar Objetivo</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .objectives-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .obj-info {
      display: flex;
      flex-direction: column;
    }
    .obj-name {
      font-weight: 600;
      color: var(--primary);
    }
    .actions-row {
      display: flex;
      gap: 0.35rem;
    }
    .row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
    
    .priority-tag {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.15rem 0.45rem;
      border-radius: 0.25rem;
    }
    .priority-tag.alta { background: #fee2e2; color: #b91c1c; }
    .priority-tag.media { background: #fef3c7; color: #b45309; }
    .priority-tag.baja { background: #f1f5f9; color: #475569; }

    .status-pill.active {
      font-size: 0.75rem;
      font-weight: 700;
      color: #15803d;
      background: #dcfce7;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
    }
  `]
})
export class ObjectivesComponent implements OnInit {
  private readonly strategyService = inject(StrategyService);
  private readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);

  readonly objectives = signal<StrategicObjective[]>([]);
  readonly showModal = signal<boolean>(false);
  readonly editingId = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    perspective: ['FINANCIERA' as PerspectiveType, Validators.required],
    description: [''],
    owner: ['', Validators.required],
    priority: ['Alta'],
    weight: [35, [Validators.required, Validators.min(1), Validators.max(100)]],
    status: ['Activo']
  });

  ngOnInit(): void {
    this.loadObjectives();
  }

  loadObjectives(): void {
    this.strategyService.getObjectives().subscribe(data => this.objectives.set(data));
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      perspective: 'FINANCIERA',
      description: '',
      owner: this.authService.currentUser()?.name || '',
      priority: 'Alta',
      weight: 35,
      status: 'Activo'
    });
    this.showModal.set(true);
  }

  openEditModal(obj: StrategicObjective): void {
    this.editingId.set(obj.id);
    this.form.patchValue({
      name: obj.name,
      perspective: obj.perspective,
      description: obj.description,
      owner: obj.owner,
      priority: obj.priority,
      weight: obj.weight,
      status: obj.status
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveObjective(): void {
    if (this.form.invalid) return;

    const val = this.form.value as Partial<StrategicObjective>;
    if (this.editingId()) {
      this.strategyService.updateObjective(this.editingId()!, val).subscribe(() => {
        this.closeModal();
        this.loadObjectives();
      });
    } else {
      this.strategyService.createObjective(val).subscribe(() => {
        this.closeModal();
        this.loadObjectives();
      });
    }
  }

  deleteObjective(id: string): void {
    if (confirm(`¿Estás seguro de eliminar el objetivo ${id}?`)) {
      this.strategyService.deleteObjective(id).subscribe(() => this.loadObjectives());
    }
  }
}
