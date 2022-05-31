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
          console.log('Append History : PROPOSED ARRAY ', existingValues, newValues);
          newTarget.values = isTimeInOrder([...existingValues, ...newValues])
            ? [...existingValues, ...newValues]
            : [...existingValues];

          oldData[targetIndex] = newTarget;
        }
      }

      console.log(
        'Websocket Data',
        oldData.find(
          (item: BiometricData) => item.biometricId == 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445'
        ).values
      );

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

      console.log('Prepend History : Incoming Data ', newData);
      for (const newItem of newData) {
        console.log('Prepend History : Looking for ', newItem.label, newItem);
        const targetIndex: any = oldData.findIndex((item: any) => item.label == newItem.label);
        if (targetIndex < 0) {
          console.log('Prepend History : Not Found Item ', newItem);
          oldData.push(newItem);
        } else {
          const newTarget = { ...oldData[targetIndex] };

          const existingValues = oldData[targetIndex].values;
          const newValues = newItem.values;
          const values = [...newValues, ...existingValues];

          console.log('Prepend History : VALUES ', newTarget.label, values);

          if (isTimeInOrder(values)) {
            newTarget.values = values;
          } else {
            newTarget.values = existingValues;
          }
          oldData[targetIndex] = newTarget;
          console.log('PrePEND DATA ::: updated', oldData);
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
