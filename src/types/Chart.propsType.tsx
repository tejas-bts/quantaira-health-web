// import { Time } from 'lightweight-charts';

export interface ChartPropsType {
  title: string;
  color: string;
  Icon: React.ComponentType;
  curveType: 'smooth' | 'straight' | 'stepline';
  idealMin: number | string;
  idealMax: number | string;
  unit: string;
  values: Array<[any, number]>;
  notes: Array<any>;
  medications: Array<any>;
  onClick?: any;
  onNoteClick?: any;
  onMedicationClick?: any;
  onDataDemand?: any;
}

export interface CombinedChartData {
  title: string;
  color: string;
  Icon: React.ComponentType;
  idealMin?: number | string;
  idealMax?: number | string;
  unit?: string;
  values: Array<[any, number]>;
  showOnchart?: boolean;
}

export interface CombinedChartPropsType {
  combinedChartData?: Array<CombinedChartData>;
}
