import { createSlice } from '@reduxjs/toolkit';

export const biometrics = createSlice({
  name: 'biometrics',
  initialState: {
    biometricData: []
  },
  reducers: {
    appendToBiometricData: (state, action) => {
      return {
        ...state,
        biometricData: action.payload.data,
      };
    },
  }
});


export const { appendToBiometricData } = biometrics.actions;
export default biometrics.reducer;