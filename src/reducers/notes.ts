import { createSlice } from '@reduxjs/toolkit';

export const notesState = createSlice({
  name: 'notes',
  initialState: {
    data: [],
  },
  reducers: {
    addToNotes: (state, action) => {
      return {
        data: action.payload.notes,
      };
    },

  }
});


export const { addToNotes } = notesState.actions;
export default notesState.reducer;