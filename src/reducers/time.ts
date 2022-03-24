import { createSlice } from '@reduxjs/toolkit';

export const timeState = createSlice({
  name: 'time',
  initialState: {
    currentTime: new Date().getTime(),
    isLive: true,
  },
  reducers: {
    setTime: (state, action) => {
      return {
        ...state,
        currentTime: action.payload.time,
      };
    },
    setLive: (state, action) => {
      return {
        ...state,
        isLive: action.payload,
      };
    },
  }
});


export const { setTime, setLive } = timeState.actions;
export default timeState.reducer;