import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategyService } from '../../core/services/strategy.service';
import { KpiService } from '../../core/services/kpi.service';
import { Perspective, StrategicObjective, StrategyLink } from '../../core/models/strategy.model';
import { Kpi } from '../../core/models/kpi.model';

@Component({
  selector: 'app-strategy-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="strategy-map-page">
      <div class="page-header">
        <div>
          <h1>Mapa Estratégico Interactivo</h1>
          <p class="text-muted">Relaciones de Causa y Efecto entre los 12 Objetivos Estratégicos (TechPeru SAC 2025)</p>
        </div>
      </div>

      <div class="map-layout">
        <!-- Lienzo de Perspectivas en Cascada -->
        <div class="map-canvas card">
          <!-- 1. FINANCIERA -->
          <div class="perspective-band fin">
            <div class="band-label">
              <span class="band-icon">💰</span>
              <span>PERSPECTIVA FINANCIERA</span>
            </div>
            <div class="nodes-row">
              @for (obj of getObjectivesFor('FINANCIERA'); track obj.id) {
                <div class="objective-node" [class.selected]="selectedObjective()?.id === obj.id" (click)="selectObjective(obj)">
                  <span class="node-id">{{ obj.id }}</span>
                  <span class="node-name">{{ obj.name }}</span>
                  <div class="node-meta">
                    <span class="node-owner">👤 {{ obj.owner }}</span>
                    <span class="node-weight">{{ obj.weight }}%</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Conector / Flechas hacia Clientes -->
          <div class="cascade-connector">
            <span class="connector-arrow">▲ Impacto Estratégico Directo ▲</span>
          </div>

          <!-- 2. CLIENTES -->
          <div class="perspective-band cli">
            <div class="band-label">
              <span class="band-icon">👥</span>
              <span>PERSPECTIVA DE CLIENTES</span>
            </div>
            <div class="nodes-row">
              @for (obj of getObjectivesFor('CLIENTES'); track obj.id) {
                <div class="objective-node" [class.selected]="selectedObjective()?.id === obj.id" (click)="selectObjective(obj)">
                  <span class="node-id">{{ obj.id }}</span>
                  <span class="node-name">{{ obj.name }}</span>
                  <div class="node-meta">
                    <span class="node-owner">👤 {{ obj.owner }}</span>
                    <span class="node-weight">{{ obj.weight }}%</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="cascade-connector">
            <span class="connector-arrow">▲ Entrega de Valor y Satisfacción ▲</span>
          </div>

          <!-- 3. PROCESOS INTERNOS -->
          <div class="perspective-band pro">
            <div class="band-label">
              <span class="band-icon">🔧</span>
              <span>PERSPECTIVA DE PROCESOS INTERNOS</span>
            </div>
            <div class="nodes-row">
              @for (obj of getObjectivesFor('PROCESOS'); track obj.id) {
                <div class="objective-node" [class.selected]="selectedObjective()?.id === obj.id" (click)="selectObjective(obj)">
                  <span class="node-id">{{ obj.id }}</span>
                  <span class="node-name">{{ obj.name }}</span>
                  <div class="node-meta">
                    <span class="node-owner">👤 {{ obj.owner }}</span>
                    <span class="node-weight">{{ obj.weight }}%</span>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="cascade-connector">
            <span class="connector-arrow">▲ Habilitación Operativa y Calidad ▲</span>
          </div>

          <!-- 4. APRENDIZAJE Y CRECIMIENTO (Base) -->
          <div class="perspective-band apr">
            <div class="band-label">
              <span class="band-icon">📚</span>
              <span>PERSPECTIVA DE APRENDIZAJE Y CRECIMIENTO</span>
            </div>
            <div class="nodes-row">
              @for (obj of getObjectivesFor('APRENDIZAJE'); track obj.id) {
                <div class="objective-node" [class.selected]="selectedObjective()?.id === obj.id" (click)="selectObjective(obj)">
                  <span class="node-id">{{ obj.id }}</span>
                  <span class="node-name">{{ obj.name }}</span>
                  <div class="node-meta">
                    <span class="node-owner">👤 {{ obj.owner }}</span>
                    <span class="node-weight">{{ obj.weight }}%</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Panel Lateral de Inspección Causa-Efecto -->
        <div class="inspection-panel card">
          @if (selectedObjective()) {
            <div class="inspection-header">
              <span class="badge-status good">{{ selectedObjective()!.id }}</span>
              <h3>{{ selectedObjective()!.name }}</h3>
              <p class="text-xs text-muted">{{ selectedObjective()!.perspective }} · Ponderación: {{ selectedObjective()!.weight }}%</p>
            </div>

            <div class="inspection-desc">
              <label class="form-label">Propósito Estratégico:</label>
              <p class="desc-text">{{ selectedObjective()!.description }}</p>
            </div>

            <div class="inspection-links mt-3">
              <label class="form-label">Relaciones Causa - Efecto vinculadas:</label>
              @if (connectedLinks().length === 0) {
                <p class="text-xs text-muted">Sin enlaces explícitos registrados</p>
              } @else {
                <div class="links-list">
                  @for (link of connectedLinks(); track link.id) {
                    <div class="link-item">
                      <span class="link-arrow">{{ link.sourceObjectiveId === selectedObjective()!.id ? '➜ Impacta a:' : '⬅ Impulsado por:' }}</span>
                      <strong>{{ link.sourceObjectiveId === selectedObjective()!.id ? link.targetObjectiveId : link.sourceObjectiveId }}</strong>
                      <p class="link-desc">{{ link.description }}</p>
                    </div>
                  }
                </div>
              }
            </div>

            <div class="linked-kpis mt-4">
              <label class="form-label">Indicadores KPI asociados ({{ associatedKpis().length }}):</label>
              <div class="kpi-mini-list">
                @for (kpi of associatedKpis(); track kpi.id) {
                  <div class="kpi-mini-card">
                    <div class="kpi-mini-top">
                      <strong>{{ kpi.id }}</strong>
                      <span class="badge-status btn-sm" [ngClass]="kpi.status.toLowerCase().replace('_', '-')">
                        {{ kpi.compliance | number:'1.0-0' }}%
                      </span>
                    </div>
                    <span class="kpi-mini-name">{{ kpi.name }}</span>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="empty-selection">
              <div class="empty-icon">👆</div>
              <h4>Selecciona un Objetivo</h4>
              <p class="text-xs text-muted">Haz clic en cualquier nodo del mapa para inspeccionar sus relaciones de causa-efecto y sus indicadores KPI asociados.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .strategy-map-page {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .map-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
    .map-canvas {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem;
      background: #f8fafc;
    }
    .perspective-band {
      border-radius: 0.75rem;
      padding: 1rem;
      border: 1px solid var(--border-color);
      background: #ffffff;
    }
    .perspective-band.fin { border-left: 5px solid #1d4ed8; }
    .perspective-band.cli { border-left: 5px solid #0d9488; }
    .perspective-band.pro { border-left: 5px solid #d97706; }
    .perspective-band.apr { border-left: 5px solid #7c3aed; }
    
    .band-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      letter-spacing: 0.05em;
    }
    .nodes-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }
    .objective-node {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .objective-node:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .objective-node.selected {
      background: #eff6ff;
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent);
    }
    .node-id {
      font-size: 0.7rem;
      font-weight: 800;
      color: var(--accent);
    }
    .node-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--primary);
      margin: 0.25rem 0 0.5rem;
      line-height: 1.25;
    }
    .node-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
      border-top: 1px solid #e2e8f0;
      padding-top: 0.35rem;
    }
    .cascade-connector {
      text-align: center;
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      letter-spacing: 0.1em;
      padding: 0.2rem 0;
    }
    .inspection-panel {
      position: sticky;
      top: 1.5rem;
      max-height: calc(100vh - 3rem);
      overflow-y: auto;
    }
    .inspection-header {
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
      margin-bottom: 1rem;
    }
    .desc-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
      background: #f8fafc;
      padding: 0.75rem;
      border-radius: 0.35rem;
      border: 1px solid #e2e8f0;
    }
    .links-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .link-item {
      padding: 0.55rem;
      background: #f1f5f9;
      border-radius: 0.35rem;
      font-size: 0.8rem;
    }
    .link-arrow {
      color: var(--accent);
      font-weight: 600;
      margin-right: 0.35rem;
    }
    .link-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
    }
    .kpi-mini-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .kpi-mini-card {
      padding: 0.55rem;
      border: 1px solid var(--border-color);
      border-radius: 0.35rem;
      background: #ffffff;
    }
    .kpi-mini-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.2rem;
    }
    .kpi-mini-name {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .empty-selection {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-muted);
    }
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }
  `]
})
export class StrategyMapComponent implements OnInit {
  private readonly strategyService = inject(StrategyService);
  private readonly kpiService = inject(KpiService);

  readonly objectives = signal<StrategicObjective[]>([]);
  readonly links = signal<StrategyLink[]>([]);
  readonly allKpis = signal<Kpi[]>([]);
  readonly selectedObjective = signal<StrategicObjective | null>(null);

  ngOnInit(): void {
    this.strategyService.getObjectives().subscribe(data => {
      this.objectives.set(data);
      if (data.length > 0) {
        this.selectObjective(data[0]);
      }
    });
    this.strategyService.getStrategyLinks().subscribe(data => this.links.set(data));
    this.kpiService.getKpis().subscribe(data => this.allKpis.set(data));
  }

  getObjectivesFor(persp: string): StrategicObjective[] {
    return this.objectives().filter(o => o.perspective === persp);
  }

  selectObjective(obj: StrategicObjective): void {
    this.selectedObjective.set(obj);
  }

  connectedLinks(): StrategyLink[] {
    const sel = this.selectedObjective();
    if (!sel) return [];
    return this.links().filter(l => l.sourceObjectiveId === sel.id || l.targetObjectiveId === sel.id);
  }

  associatedKpis(): Kpi[] {
    const sel = this.selectedObjective();
    if (!sel) return [];
    return this.allKpis().filter(k => k.objectiveId === sel.id);
  }
}
