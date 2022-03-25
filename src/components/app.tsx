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
// import { setLive, setTime } from '../reducers/time';

const App = () => {
  const user: any = useSelector((state: any) => state.auth);
  const bed: any = useSelector((state: any) => state.patient.bed);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  console.log('User', user);

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

  useEffect(() => {
    loadHospitalData();
  }, []);

  useEffect(() => {
    const socket = Client(baseURLws);
    if (bed !== undefined) {
      socket.on('connect', () => {
        toast('Successfully connected to server');
        socket.on(bed.bedId, ({ data }: any) => {
          dispatch(appendToBiometricData({ data }));
        });
      });

      socket.on('disconnect', () => {
        console.log(socket.id);
        console.log(socket.connected); // true
      });
    }

    return () => {
      socket.removeAllListeners();
    };
  }, [bed]);

  return (
    <>
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
        <div className="app-header">
          <Header
            onPatientChange={() => {
              console.log('');
            }}
            onDateTimeChange={() => console.log('')}
          />
        </div>
        <div className="main-container">
          <Routes>
            <Route path="patient" element={<PatientSelection />} />
            <Route path="charts/*" element={<BiometricCharts />} />
            <Route path="kpi" element={<BiometricKpi />} />
            <Route path="/" element={<Navigate to="patient" />} />
          </Routes>
        </div>
        <div className="bottom-nav-bar-container">
          <BottomNavigationBar />
        </div>
      </div>
    </>
  );
};

export default App;
