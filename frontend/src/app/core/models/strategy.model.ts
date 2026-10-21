export type PerspectiveType = 'FINANCIERA' | 'CLIENTES' | 'PROCESOS' | 'APRENDIZAJE';

export interface Perspective {
  code: string;
  type: PerspectiveType;
  label: string;
  color: string;
  softColor: string;
  icon: string;
  displayOrder: number;
}

export interface StrategicObjective {
  id: string;
  name: string;
  perspective: PerspectiveType;
  description: string;
  owner: string;
  priority: string;
  weight: number;
  status: string;
  created?: string;
}

export interface StrategyLink {
  id: string;
  sourceObjectiveId: string;
  targetObjectiveId: string;
  description: string;
  strength: string;
}
