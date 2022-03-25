/* eslint-disable @typescript-eslint/no-array-constructor */
import { createSlice, current } from '@reduxjs/toolkit';

export const chartsState = createSlice({
  name: 'chartSelection',
  initialState: {
    selectedCharts: [new Array()],
    selectedScreen: 0,
  },
  reducers: {
    removeChartFromScreen: (state, action) => {
      const currentSelectedCharts: Array<Array<string>> = [...current(state).selectedCharts];
      const targetScreenIndex: number = action.payload.screen;
      const targetChart = action.payload.chart;
      const newScreen = [...currentSelectedCharts[targetScreenIndex]].filter((item) => item !== targetChart);
      currentSelectedCharts[targetScreenIndex] = [...newScreen];
      return { ...state, selectedCharts: currentSelectedCharts };
    },

    addChartToScreen: (state, action) => {
      const chart = action.payload.chart;
      let index = action.payload.screen;
      const currentSelectedCharts: Array<Array<string>> = [...current(state).selectedCharts];

      console.log('addChartToScreen', currentSelectedCharts);
      if (currentSelectedCharts[index] !== undefined) {
        while (currentSelectedCharts[index] && currentSelectedCharts[index].length >= 3) {
          index++;
        }
      }
      const currentTargetScreen = currentSelectedCharts[index] || [];
      const newTargetScreen = [...currentTargetScreen, chart];
      currentSelectedCharts[index] = newTargetScreen;

      console.log('addChartToScreen', { ...state, selectedCharts: currentSelectedCharts });

      return { ...state, selectedCharts: currentSelectedCharts };

    },

    selectScreen: (state, action) => {
      return { ...state, selectedScreen: action.payload };
    },

    nextScreen: (state) => {
      return { ...state, selectedScreen: Math.min(current(state).selectedScreen + 1, current(state).selectedCharts.length - 1) };
    },

    previousScreen: (state) => {
      return { ...state, selectedScreen: Math.max(0, current(state).selectedScreen - 1) };
    }
  }
});


export const { addChartToScreen, removeChartFromScreen, selectScreen, nextScreen, previousScreen } = chartsState.actions;
export default chartsState.reducer;