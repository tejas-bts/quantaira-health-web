import React, { useEffect } from 'react';
import Header from './core/Header';
import { io as Client } from 'socket.io-client';
import BottomNavigationBar from './core/BottomNavigationBar';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import BiometricCharts from '../pages/BiometricCharts';
import PatientSelection from '../pages/PatientSelection';

import BiometricKpi from '../pages/BiometricKpi';
import { ToastContainer, toast } from 'react-toastify';
import { fetchHospitalData } from '../services/hospital.services';
import { useDispatch, useSelector } from 'react-redux';
import { selectHospital } from '../reducers/patient';
import { appendToBiometricData } from '../reducers/biometrics';
import { baseURLws } from '../utils/constants';

import { IntlProvider } from 'react-intl';
import MultiLingualLabel from './core/MultiLingualLabel';
import { authenticateAxios } from '../services/authenticatedAxios';
import CombinedBiometricCharts from '../pages/CombinedBiometricCharts';
import { fetchMedications } from '../services/medications.services';
import { addToMedications } from '../reducers/medications';
import { addToNotes } from '../reducers/notes';
import { Note } from '../types/Core.types';
import { fetchNotes } from '../services/notes.services';
import { appendToHistoricData } from '../reducers/history';
import { StateReducer } from '../types/Reducer.types';

class StaticData {
  static isLive = false;
}

const App = () => {
  const user: any = useSelector((state: StateReducer) => state.auth);
  const bed = useSelector((state: StateReducer) => state.patient.bed);
  const headerBlur = useSelector((state: StateReducer) => state.appState.headerBlur);
  const contentBlur = useSelector((state: StateReducer) => state.appState.contentBlur);
  const isLive = useSelector((state: StateReducer) => state.time.isLive);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user) {
    console.log('User Not found', user);
    navigate('/user', { replace: true });
  }

  const loadHospitalData = async () => {
    let userData: any = localStorage.getItem('user');
    if (userData) userData = JSON.parse(userData);
    const hospitalData = userData ? userData.userAccess : await fetchHospitalData(1);
    dispatch(selectHospital(hospitalData));
  };

  const loadNotesAndMedication = async () => {
    try {
      const medications: any = await fetchMedications({
        patientId: String(bed.patientID),
        deviceId: '123',
      });
      dispatch(addToMedications({ medications }));
    } catch (e) {
      toast(<MultiLingualLabel id="ERROR_FETCHING_MEDICATIONS" />);
    }

    try {
      const notes: Array<Note> | undefined = await fetchNotes({
        patientId: String(bed.patientID),
        deviceId: '123',
      });

      dispatch(addToNotes({ notes }));
    } catch (e) {
      toast(<MultiLingualLabel id="ERROR_FETCHING_NOTES" />);
    }
  };

  useEffect(() => {
    loadHospitalData();
    authenticateAxios();
  }, []);

  useEffect(() => {
    StaticData.isLive = isLive;
  }, [isLive]);

  useEffect(() => {
    const socket = Client(baseURLws);
    if (bed !== undefined) {
      socket.on('connect', () => {
        toast(<MultiLingualLabel id="SUCCESSFULLY_CONNECTED_TO_SERVER" />);
        socket.on(bed.bedId, ({ data }: any) => {
          dispatch(appendToBiometricData({ data }));
          if (StaticData.isLive) dispatch(appendToHistoricData({ data }));
        });
      });

      socket.on('disconnect', () => {
        console.log(socket.id);
        console.log(socket.connected); // true
      });

      loadNotesAndMedication();
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [bed]);

  const locale = useSelector((state: any) => state.language.selectedLocale);

  return (
    <IntlProvider locale="en" messages={locale}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="d-flex flex-column h-100">
        <div className={`app-header ${headerBlur ? 'blur' : ''}`}>
          <Header onDateTimeChange={() => console.log('')} />
        </div>
        <div className={`main-container ${contentBlur ? 'blur' : ''}`}>
          <Routes>
            <Route path="patient" element={<PatientSelection />} />
            <Route path="charts/*" element={<BiometricCharts />} />
            <Route path="combined-charts" element={<CombinedBiometricCharts />} />
            <Route path="kpi" element={<BiometricKpi />} />
            <Route path="/" element={<Navigate to="patient" />} />
          </Routes>
        </div>
        <div className="bottom-nav-bar-container">
          <BottomNavigationBar />
        </div>
      </div>
    </IntlProvider>
  );
};

export default App;
