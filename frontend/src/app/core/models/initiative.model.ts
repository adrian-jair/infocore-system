export interface StrategicInitiative {
  id: string;
  name: string;
  objectiveId: string;
  kpiId?: string;
  owner: string;
  area: string;
  startDate: string;
  endDate: string;
  budget: number;
  progress: number;
  status: string;
  description: string;
}
