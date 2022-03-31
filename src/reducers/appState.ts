import { createSlice } from '@reduxjs/toolkit';

export const appState = createSlice({
  name: 'appState',
  initialState: {
    showSettings: false,
    headerBlur: false,
    contentBlur: false,
    footerBlur: false,
  },
  reducers: {
    hideSettings: (state) => {
      return {
        ...state,
        showSettings: false,
        headerBlur: false,
        contentBlur: false,
      };
    },
    showSettings: (state) => {
      return {
        ...state,
        showSettings: true,
        headerBlur: true,
        contentBlur: true,
      };
    },
  }
});


export const { hideSettings, showSettings } = appState.actions;
export default appState.reducer;