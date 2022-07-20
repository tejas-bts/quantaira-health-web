/* eslint-disable no-unused-vars */
// import { Time } from 'lightweight-charts';

import { ISeriesApi } from 'lightweight-charts';

export interface ChartPropsType {
  title: string;
  color: string;
  Icon: React.ComponentType;
  curveType: 'smooth' | 'straight' | 'stepline';
  idealMin?: number;
  idealMax?: number;
  unit: string;
  values: Array<[any, number]>;
  history?: Array<[any, number]>;
  notes: Array<any>;
  medications: Array<any>;
  onClick?: any;
  onNoteClick?: any;
  onMedicationClick?: any;
  isLive: boolean;
  chartTime: Date;
  onDataDemand?: (time: number, direction: 'to' | 'from') => Promise<void>;
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
  currentValue: number | string;
}

export interface CombinedChartPropsType {
  combinedChartData?: Array<CombinedChartData>;
  onDataDemand?: (time: number, direction: 'to' | 'from') => Promise<void>;
  notes?: Array<any>;
  medications?: Array<any>;
  onClick?: any;
  onNoteClick?: any;
  onMedicationClick?: any;
}

export interface SelectedChartItem {
  series: ISeriesApi<'Line'>;
  chart: CombinedChartData;
  title: string;
}
