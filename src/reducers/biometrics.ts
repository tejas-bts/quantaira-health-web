/* eslint-disable no-unused-vars */
import { createSlice, current } from '@reduxjs/toolkit';

export const biometrics = createSlice({
  name: 'biometrics',
  initialState: {
    biometricData: [],
  },
  reducers: {
    appendToBiometricData: (state, action) => {
      const newData: any = [...action.payload.data];
      return {
        ...state,
        biometricData: newData,
      };
    },

    prependToBiometricData: (state, action) => {
      const oldData: any = [...current(state).biometricData];
      const newData: any = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const existingValues = oldData[targetIndex].values;
          const newValues = newItem.values;
          newValues.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
          newTarget.values = [...newValues, ...existingValues];
          oldData[targetIndex] = newTarget;
        }
      }
      console.log(
        'Old Data',
        oldData.find((item: any) => item.label === 'Temp')
      );

      return {
        ...state,
        biometricData: oldData,
      };
    },
  },
});

export const { appendToBiometricData, prependToBiometricData } = biometrics.actions;
export default biometrics.reducer;
