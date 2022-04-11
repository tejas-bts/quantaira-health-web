export interface KPIitemProp {
  title: string;
  color?: string;
  latestTimestamp?: number;
  currentValue: number | undefined;
  currentTime?: number | undefined;
  idealMin?: number | undefined;
  idealMax?: number | undefined;
  unit?: string | undefined;
  isLive: boolean;
}

export interface NiBpProps {
  color?: string;
  isLive: boolean;

  systolicValue: number | undefined;
  diastolicValue: number | undefined;

  idealSystolicValue: number | undefined;
  idealDiastolicValue: number | undefined;

  unit: string | undefined;
}

export interface QTIntervalProps {
  color?: string;
  isLive: boolean;

  qtcValue: number | undefined;
  idealQtc: number | undefined;
  qtcUnit: string | undefined;

  deltaQtcValue: number | undefined;
  idealDeltaQtc: number | undefined;
  deltaQtcUnit: string | undefined;

  qtValue: number | undefined;
  idealQt: number | undefined;
  qtUnit: string | undefined;
}

export interface STsegmentProps {
  color?: string;
  unit: string | undefined;
  isLive: boolean;

  st1Value: number | undefined;
  st2Value: number | undefined;
  st3Value: number | undefined;

  stAVRValue: number | undefined;
  stAVLValue: number | undefined;
  stAVFValue: number | undefined;

  stVvalue: number | undefined;
}
