import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../reducers/auth';
import patientReducer from '../reducers/patient';
import notesReducer from '../reducers/notes';
import medicationsReducer from '../reducers/medications';
import timeReducer from '../reducers/time';
import chartReducer from '../reducers/charts';
import biometricReducer from '../reducers/biometrics';
import appStateReducer from '../reducers/appState';
import language from '../reducers/language';


export default configureStore({
  reducer: {
    auth: authReducer,
    patient: patientReducer,
    notes: notesReducer,
    medications: medicationsReducer,
    time: timeReducer,
    chart: chartReducer,
    biometrics: biometricReducer,
    appState: appStateReducer,
    language: language,
  },
});