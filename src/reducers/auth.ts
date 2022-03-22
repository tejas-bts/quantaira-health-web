import { createSlice } from '@reduxjs/toolkit';

export const authState = createSlice({
  name: 'user',
  initialState: {
    loggedIn: false,
    userName: undefined,
    permissions: [],
  },
  reducers: {
    logIn: (state, action) => {
      return {
        loggedIn: true,
        userName: action.payload.userName,
        permissions: action.payload.permissions,
      };
    },

    logOut: () => {
      return {
        loggedIn: false,
        userName: undefined,
        permissions: [],
      };
    }
  }
});


export const { logIn, logOut } = authState.actions;
export default authState.reducer;