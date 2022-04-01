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
        const target: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (target < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[target] };
          newTarget.values = [...newTarget.values, ...newItem.values];
          oldData[target] = newTarget;
        }
      }

      return {
        ...state,
        biometricData: oldData,
      };
    },
  }
});


export const { appendToBiometricData } = biometrics.actions;
export default biometrics.reducer;