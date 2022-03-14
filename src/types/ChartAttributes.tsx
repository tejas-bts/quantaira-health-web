export enum ChartTitle {
  HR,
  SpO2,
  IBP,
  Temp,
  NIBP,
  ECG,
  CO2,
}

export enum ChartColor {
  HR = 'red',
  SpO2 = 'blue',
  IBP = 'green',
  Temp = 'yellow',
  NIBP = 'purple',
  ECG = 'voilet',
  CO2 = 'indigo',
}

export interface ApexChartData {
  data: Array<[number, number]>;
  name: string;
}
