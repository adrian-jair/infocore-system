import { PerspectiveType } from './strategy.model';

export type KpiDirection = 'MAYOR_MEJOR' | 'MENOR_MEJOR' | 'RANGO';
export type TrafficLightStatus = 'LOGRADO' | 'EN_RIESGO' | 'CRITICO' | 'SIN_DATOS';

export interface KpiMeasurement {
  id: string;
  kpiId: string;
  period: string;
  date: string;
  value: number;
  notes?: string;
  responsible?: string;
}

export interface Kpi {
  id: string;
  name: string;
  perspective: PerspectiveType;
  objectiveId: string;
  unit: string;
  formula: string;
  baseline: number;
  target: number;
  current: number;
  direction: KpiDirection;
  frequency: string;
  owner: string;
  area: string;
  weight: number;
  recommendation: string;
  description: string;
  lower?: number;
  upper?: number;
  alertAt?: number;
  criticalAt?: number;
  targetAt?: number;
  compliance: number | null;
  status: TrafficLightStatus;
  measurements?: KpiMeasurement[];
}
