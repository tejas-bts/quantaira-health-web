import reducer, { appendToBiometricData, prependToBiometricData } from '../reducers/biometrics';

test('should append a single value to the biometric data', () => {
  const previousState = {
    biometricData: []
  };

  const data = [{
    'label': 'Temp',
    'biometricId': 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
    'description': 'Temprature',
    'unit': 'C',
    'idealMin': 35,
    'idealMax': 37.5,
    'values': [
      [
        1649794435000,
        19.8
      ],
      [
        1649794431000,
        19.9
      ],
      [
        1649794433000,
        19.9
      ],
      [
        1649794437000,
        19.8
      ]
    ]
  }];
  expect(reducer(previousState, appendToBiometricData(data))).toEqual([
    {
      text: 'Run the tests',
      completed: false,
      id: 0
    }
  ]);
});

test('should append a single value to the biometric data', () => {
  const previousState = {
    biometricData: []
  };
  expect(reducer(previousState, prependToBiometricData('Run the tests'))).toEqual([
    {
      text: 'Run the tests',
      completed: false,
      id: 0
    }
  ]);
});