export interface BiometricData {
  label: string;
  description: string | undefined;
  unit: string | undefined;
  idealMin: number | undefined;
  idealMax: number | undefined;
  values: Array<[number, number]>;
  currentValue: number | undefined;
}

export type HistoricData = BiometricData;

export class BioMetricDataObj implements BiometricData {
  label: string;
  description: string | undefined;
  unit: string | undefined;
  idealMin: number | undefined;
  idealMax: number | undefined;
  values: Array<[number, number]>;
  currentValue: number | undefined;
  lastTimeStamp: number;

  constructor(label: string) {
    this.label = label;
    this.values = [];
    this.currentValue = this.values.length ? this.values[0][1] : undefined;
    this.lastTimeStamp = 0;
  }
}
