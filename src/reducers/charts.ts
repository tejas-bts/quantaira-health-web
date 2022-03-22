import { createSlice, current } from '@reduxjs/toolkit';

export const chartsState = createSlice({
  name: 'chartSelection',
  initialState: {
    selectedCharts: [],
  },
  reducers: {
    removeChartFromScreen: (state, action) => {
      const currentSelectedCharts = [...current(state).selectedCharts];
      currentSelectedCharts
      return state;
    },

    addChartToScreen: (state, action) => {
      return state;
    }
  }
});


export const { addChartToScreen, removeChartFromScreen } = chartsState.actions;
export default chartsState.reducer;