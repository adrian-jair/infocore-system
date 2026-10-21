import { Kpi, TrafficLightStatus } from './kpi.model';
import { PerspectiveType } from './strategy.model';

export interface PerspectiveBreakdown {
  perspective: PerspectiveType;
  label: string;
  code: string;
  icon: string;
  color: string;
  softColor: string;
  compliance: number | null;
  totalKpis: number;
  goodCount: number;
  warnCount: number;
  badCount: number;
}

export interface MonthlyTrend {
  period: string;
  label: string;
  compliance: number;
}

export interface DashboardSummary {
  company: string;
  period: string;
  globalCompliance: number;
  globalStatus: TrafficLightStatus;
  totalObjectives: number;
  totalKpis: number;
  totalInitiatives: number;
  totalBudget: number;
  averageProgress: number;
  goodKpisCount: number;
  warnKpisCount: number;
  badKpisCount: number;
  noDataKpisCount: number;
  perspectives: PerspectiveBreakdown[];
  monthlyTrends: MonthlyTrend[];
  criticalKpis: Kpi[];
}
