export const BiometricParameters = {

  Temp: 'Temp',
  SpO2: 'SpO2',
  HR: 'HR',
  PR: 'PR',
  RR: 'RR',
  NIBP: 'NIBP',
  ST1: 'ST 1',
  ST2: 'ST 2',
  ST3: 'ST 3',
  STaVR: 'ST aVR',
  STaVL: 'ST aVL',
  STaVF: 'ST aVF',
  STV: 'ST V',
  QT: 'QT',
  DeltaQTc: 'delta QTc',
  QTc: 'QTc',
  NIBPsys: 'NiBP SYS',
  NIBPdia: 'NiBP DIA',
  NiBPpr: 'NiBP PR',
  NiBPmap: 'NiBP MAP'
};


const baseUrl = '127.0.0.1';
export const baseURLws = `http://${baseUrl}:3001`;
export const baseURLhttp = `http://${baseUrl}:7071/api`;