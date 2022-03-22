import { createSlice } from '@reduxjs/toolkit';

export const medicationsState = createSlice({
  name: 'medications',
  initialState: {
    data: [],
  },
  reducers: {
    addToMedications: (state, action) => {
      return {
        data: action.payload.medications,
      };
    },

  }
});


export const { addToMedications } = medicationsState.actions;
export default medicationsState.reducer;