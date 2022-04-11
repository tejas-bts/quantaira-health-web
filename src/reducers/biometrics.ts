/* eslint-disable no-unused-vars */
import { createSlice, current } from '@reduxjs/toolkit';

export const biometrics = createSlice({
  name: 'biometrics',
  initialState: {
    biometricData: []
  },
  reducers: {
    appendToBiometricData: (state, action) => {
      const oldData: any = [...current(state).biometricData];
      const newData: any = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const existingValues = oldData[targetIndex].values;
          newTarget.values = [...existingValues, ...newItem.values];
          oldData[targetIndex] = newTarget;
        }
      }

      return {
        ...state,
        biometricData: oldData,
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
          newTarget.values = [...newItem.values, ...existingValues];
          oldData[targetIndex] = newTarget;
        }
      }
      console.log('Old Data', oldData.find((item: any) => item.label === 'Temp'));

      return {
        ...state,
        biometricData: oldData,
      };
    },

  }
});


export const { appendToBiometricData, prependToBiometricData } = biometrics.actions;
export default biometrics.reducer;