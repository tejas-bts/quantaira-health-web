import { createSlice } from '@reduxjs/toolkit';
import AppLocale from '../languages';

export const language = createSlice({
  name: 'language',
  initialState: {
    selectedLanguage: AppLocale[0].label,
    selectedLocale: AppLocale[0].locale,
  },
  reducers: {
    selectLanguage: (state, action) => {
      return {
        selectedLanguage: action.payload.label,
        selectedLocale: action.payload.locale,
      };
    },
  }
});


export const { selectLanguage } = language.actions;
export default language.reducer;