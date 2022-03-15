import React, { useState, useEffect } from 'react';
import Header from './core/Header';
import { io as Client } from 'socket.io-client';
import BottomNavigationBar from './core/BottomNavigationBar';
import { Route, Routes, Navigate } from 'react-router-dom';
import BiometricCharts from '../pages/BiometricCharts';
import PatientSelection from '../pages/PatientSelection';

import { BiometricData } from '../types/WebsocketData';
import BiometricKpi from '../pages/BiometricKpi';
import AppContext from '../contexts/AppContext';
import { ToastContainer, toast } from 'react-toastify';
import { fetchNotes } from '../services/notes.services';
// import { Provider } from 'react-redux';
// import store from './store';

const App = () => {
  const [biometricData, setBiometricData] = useState<Array<BiometricData>>([]);
  const [notesAndMedicationData, setNotesAndMedicationData] = useState<any>([]);
  const [patient, setPatient] = useState({
    hospitalId: 1,
    floorNumber: 2,
    roomNumber: 2,
    patientId: 1234,
    bedId: 1,
  });
  const [dateTime, setDateTime] = useState(new Date());
  const [chartSelections, setChartSelection] = useState<Array<string>>([]);

  const loadNotesAndMedications = async () => {
    try {
      const notes: any = await fetchNotes({
        pid: '1234',
        device: '123',
      });
      setNotesAndMedicationData(
        notes.map((item: any) => {
          return [item.input_time, 10];
        })
      );
    } catch (e) {
      toast('There was a problem fetching notes and medication data!');
      console.log('There was an error', e);
    }
  };

  useEffect(
    () => console.log('Chart Selection Changed', chartSelections),
    [chartSelections]
  );

  useEffect(() => {
    loadNotesAndMedications();
  }, []);

  useEffect(() => {
    // const socket = Client('http://40.76.196.190:3001');
    const socket = Client('http://192.168.1.29:3001');

    socket.on('connect', () => {
      console.log(socket.id);
      console.log(socket.connected); // true
      toast('Successfully connected to server');
      socket.on('bed007', ({ data }) => {
        setBiometricData(data);
      });
    });

    socket.on('disconnect', () => {
      console.log(socket.id);
      console.log(socket.connected); // true
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);

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
          <Header onPatientChange={setPatient} onDateTimeChange={setDateTime} />
        </div>
        <div className="main-container">
          <AppContext.Provider value={{ patient, dateTime, chartSelections }}>
            <Routes>
              <Route path="patient" element={<PatientSelection />} />
              <Route
                path="charts/*"
                element={
                  <BiometricCharts
                    biometricData={biometricData}
                    notesAndMedicationData={notesAndMedicationData}
                    onChartSelectionChange={setChartSelection}
                  />
                }
              />
              <Route
                path="kpi"
                element={<BiometricKpi biometricData={biometricData} />}
              />
              <Route path="/" element={<Navigate to="patient" />} />
            </Routes>
          </AppContext.Provider>
        </div>
        <div className="bottom-nav-bar-container">
          <BottomNavigationBar />
        </div>
      </div>
    </>
  );
};

export default App;
