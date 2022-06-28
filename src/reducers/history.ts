/* eslint-disable no-unused-vars */
import { createSlice, current } from '@reduxjs/toolkit';
import { BiometricData } from '../types/WebsocketData';
import { isTimeInOrder } from '../utils/utilities';

export const history = createSlice({
  name: 'history',
  initialState: {
    historicData: [],
  },
  reducers: {
    clearHistoricData: (state) => {
      const oldData: any = [...current(state).historicData];
      const newData: any = [];
      for (const oldItem of oldData) {
        const newItem = { ...oldItem };
        newItem.values = [];
        newData.push(newItem);
      }
      const retValue = {
        ...state,
        historicData: newData,
      };
      console.log('Clear History Retvalue', retValue);
      return retValue;
    },

    appendToHistoricData: (state, action: { payload: { data: Array<BiometricData> } }) => {
      const oldData: any = [...current(state).historicData];
      const newData: Array<BiometricData> = [...action.payload.data];

      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex(
          (item: BiometricData) => item.biometricId == newItem.biometricId
        );
        if (targetIndex < 0) {
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };
          const existingValues = oldData[targetIndex].values;
          const newValues = newItem.values
            .slice()
            .sort((a: [number, number], b: [number, number]) => a[0] - b[0]);
          newTarget.values = isTimeInOrder([...existingValues, ...newValues])
            ? [...existingValues, ...newValues]
            : [...existingValues];

          oldData[targetIndex] = newTarget;
        }
      }

      return {
        ...state,
        historicData: oldData,
      };
    },

    setHistoricData: (state, action) => {
      console.log('New Data', action.payload.data);
      const oldData: any = [...current(state).historicData];
      const newData: any = [...action.payload.data];
      for (const newItem of newData) {
        const targetIndex: any = oldData.findIndex(
          (item: BiometricData) => item.biometricId == newItem.biometricId
        );
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

      console.log('Setting Hostoric Data', oldData);

      return {
        ...state,
        historicData: oldData,
      };
    },

    prependToHistoricData: (state, action: { payload: { data: Array<BiometricData> } }) => {
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
          const values = [...newValues, ...existingValues];

          if (isTimeInOrder(values)) {
            newTarget.values = values;
          } else {
            newTarget.values = existingValues;
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

export const { appendToHistoricData, prependToHistoricData, setHistoricData, clearHistoricData } =
  history.actions;
export default history.reducer;
