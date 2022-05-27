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
          // const newValuesReversed = newItem.values.slice().sort((a: [number, number], b: [number, number]) => b[0] - a[0]);

          newTarget.values = isTimeInOrder([...newValues, ...existingValues])
            ? [...newValues, ...existingValues]
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
      console.log('PrePEND DATA ::: ', action.payload.data);
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
              newTarget.values = isTimeInOrder([...newValues, ...existingValues])
                ? [...newValues, ...existingValues]
                : [...existingValues];
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
