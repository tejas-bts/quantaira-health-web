export interface ChartPropsType {
  title: string;
  color: string;
  Icon: React.ComponentType;
  curveType: 'smooth' | 'straight' | 'stepline';
  idealMin: number | string;
  idealMax: number | string;
  unit: string;
  values: Array<[number, number]>;
  notes: any;
  medications: any;
  medicationData: any;
  onClick?: any;
  onNoteClick?: any;
  onMedicationClick?: any;
}
