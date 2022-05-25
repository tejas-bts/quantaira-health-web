import reducer, { appendToBiometricData } from '../reducers/biometrics';

const valuesArray = [
  [1649794435000, 19.8],
  [1649794431000, 19.9],
  [1649794433000, 19.9],
  [1649794437000, 19.8],
];
const data = [
  {
    label: 'Temp',
    biometricId: 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
    description: 'Temperature',
    unit: 'C',
    idealMin: 35,
    idealMax: 37.5,
    values: valuesArray,
  },
];

test('Appended items should be in a sorted order', () => {
  const previousState = {
    biometricData: [],
  };

  const sortedValues = valuesArray.slice().sort((a, b) => {
    return a[0] - b[0];
  });

  const expectedData = {
    biometricData: [
      {
        biometricId: 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
        description: 'Temperature',
        idealMax: 37.5,
        idealMin: 35,
        label: 'Temp',
        unit: 'C',
        values: sortedValues,
      },
    ],
  };

  expect(reducer(previousState, appendToBiometricData({ data }))).toEqual(expectedData);
});

test('Appended items should not be in a non-sorted order', () => {
  const previousState = {
    biometricData: [],
  };

  const reverseSortedValues = valuesArray.slice().sort((a, b) => {
    return b[0] - a[0];
  });

  const expectedData = {
    biometricData: [
      {
        biometricId: 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
        description: 'Temperature',
        idealMax: 37.5,
        idealMin: 35,
        label: 'Temp',
        unit: 'C',
        values: reverseSortedValues,
      },
    ],
  };

  console.log('Expected Data %j', expectedData);
  console.log('Received Data %j', reducer(previousState, appendToBiometricData({ data })));

  expect(reducer(previousState, appendToBiometricData({ data }))).not.toEqual(expectedData);
});

// test('should append a single value to the biometric data', () => {
//   const previousState = {
//     biometricData: []
//   };
//   expect(reducer(previousState, prependToBiometricData({}))).toEqual([
//     {
//       text: 'Run the tests',
//       completed: false,
//       id: 0
//     }
//   ]);
// });
