/* eslint-disable no-unused-vars */
import { createSlice, current } from '@reduxjs/toolkit';
import { BiometricData } from '../types/WebsocketData';

export const history = createSlice({
  name: 'history',
  initialState: {
    historicData: [],
  },
  reducers: {
    appendToHistoricData: (state, action) => {
      const oldData: any = [...current(state).historicData];
      const newData: Array<BiometricData> = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: number = oldData.findIndex(
          (item: BiometricData) => item.label == newItem.label
        );
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const existingValues = oldData[targetIndex].values;
          const newValues = newItem.values
            .slice()
            .sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
          // const newValuesReversed = newItem.values.slice().sort((a: [number, number], b: [number, number]) => b[0] - a[0]);

          newTarget.values = [...existingValues, ...newValues];
          oldData[targetIndex] = newTarget;
        }
      }

      return {
        ...state,
        historicData: oldData,
      };
    },

    setHistoricData: (state, action) => {
      const oldData: any = [...current(state).historicData];
      const newData: any = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const newValues = newItem.values;
          newValues.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
          newTarget.values = [...newValues];
          oldData[targetIndex] = newTarget;
        }
      }

      return {
        ...state,
        historicData: oldData,
      };
    },

    prependToHistoricData: (state, action) => {
      const oldData: any = [...current(state).historicData];
      const newData: any = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const existingValues = oldData[targetIndex].values;
          const newValues = newItem.values;
          if (newValues) newValues.sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
          if (existingValues.length > 0) {
            if (existingValues[0][0] > newValues[0][0])
              newTarget.values = [...newValues, ...existingValues];
          } else {
            newTarget.values = [...newValues];
          }

          oldData[targetIndex] = newTarget;
        }
      }

      return {
        ...state,
        historicData: oldData,
      };
    },
  },
});

export const { appendToHistoricData, prependToHistoricData, setHistoricData } = history.actions;
export default history.reducer;
