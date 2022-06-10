/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import Chart from '../components/core/SimpleChart.2';
import { GiLungs, GiHeartOrgan, GiMedicalThermometer } from 'react-icons/gi';
import { FaNotesMedical } from 'react-icons/fa';
import { BiPulse } from 'react-icons/bi';

import { BiometricData } from '../types/WebsocketData';
import ChartSelector from '../pages/control-panel/ChartSelector';
import { Route, Routes, To, useNavigate } from 'react-router-dom';
import Notes from '../pages/control-panel/Notes';
import Medications from '../pages/control-panel/Medications';
import Alarms from '../pages/control-panel/Alarms';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPastChartData } from '../services/chart.services';
import { prependToBiometricData } from '../reducers/biometrics';
import { flattenArray, getCurrentUser, localToTime, timeToLocal } from '../utils/utilities';
import { Time } from 'lightweight-charts';
import { Bed, Permission } from '../types/Core.types';
import { StateReducer } from '../types/Reducer.types';
import { appendToHistoricData, prependToHistoricData, setHistoricData } from '../reducers/history';
import { userPermissions } from '../utils/constants';
// import { logBiometricData } from '../utils/logger';

const BiometricCharts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = ['#94d699', '#e7d57d', '#c0f7ff', '#fff59d', '#FFAB91', '#CE93D8', '#80CBC4'];

  const [bufferData, setBuffer] = useState<any>({});

  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);
  const bed: Bed = useSelector((state: any) => state.patient.bed);
  const notes = useSelector((state: any) => state.notes.data);
  const medications = useSelector((state: any) => state.medications.data);
  const biometricData: any = useSelector((state: any) => state.biometrics.biometricData);
  const historicData = useSelector((state: StateReducer) => state.history.historicData);
  const isLive = useSelector((state: StateReducer) => state.time.isLive);
  const time = useSelector((state: StateReducer) => state.time.currentTime);

  const handleChartClick = (time: number) => {
    const { permissions } = getCurrentUser();

    const permissionToCreateNote = permissions.find(
      (item: Permission) => item.permissionId === userPermissions.NOTES_WRITE
    );
    if (permissionToCreateNote != undefined) {
      navigateTo(`/app/charts/notes/add/${time}`);
    } else {
      const permissionToCreateMedication = permissions.find(
        (item: Permission) => item.permissionId === userPermissions.MEDICATIONS_WRITE
      );
      if (permissionToCreateMedication != undefined) {
        navigateTo(`/app/charts/medications/add/${time}`);
      }
    }
  };

  const navigateTo = (address: To) => {
    navigate(address, {
      replace: true,
    });
  };

  const getIcon = (label: string) => {
    const icons: any = {
      HR: GiHeartOrgan,
      SpO2: GiLungs,
      Temp: GiMedicalThermometer,
      PR: BiPulse,
    };
    return icons[label] || FaNotesMedical;
  };

  const loadHistoricData = async () => {
    try {
      const params = new URLSearchParams();
      const biometricIds = flattenArray(chartSelections).map(
        (title: string) =>
          biometricData.find((item: BiometricData) => item.label === title)?.biometricId
      );

      for (const item of biometricIds) params.append('biometricId', item);
      params.append('bedId', bed.bedId);
      params.append('limit', '100');
      params.append('pid', `${bed.patientID}`);
      params.append('fromDate', `${time}`);
      const data = await fetchPastChartData(params);
      dispatch(setHistoricData({ data }));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const availableCharts: any = [];
    biometricData.map((item: BiometricData) => availableCharts.push(item.label));
    setBuffer(biometricData.map((item: any) => item.values));
  }, [biometricData]);

  useEffect(() => {
    if (!isLive) {
      loadHistoricData();
    }
  }, [isLive, time]);

  const getIndex = (label: string) => {
    const index = biometricData.findIndex((item: any) => item.label === label);
    return index;
  };

  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  const onDemand = (biometricId: any, time: number, direction: 'to' | 'from') => {
    console.log('On Demand', biometricId, direction);
    return new Promise<void>((resolve) => {
      const params = new URLSearchParams();
      params.append('bedId', bed.bedId);
      params.append('limit', '100');
      params.append('pid', `${bed.patientID}`);
      if (direction == 'from') {
        params.append('fromDate', `${time}`);
      } else {
        params.append('toDate', `${time}`);
      }
      params.append('biometricId', `${biometricId}`);

      fetchPastChartData(params)
        .then((data) => {
          console.log('Past Chart Data', data);
          if (data[0].patientId === bed.patientID) {
            if (direction == 'from' && !isLive) {
              dispatch(appendToHistoricData({ data }));
            } else {
              dispatch(prependToHistoricData({ data }));
            }
            resolve();
          }
        })
        .catch((e) => console.error(e));
    });
  };

  return (
    <div className="chart-grid">
      <div className="overflow-hidden">
        {chartSelections[selectedScreen] && chartSelections[selectedScreen][0] && (
          <Chart
            color={colors[0]}
            chartTime={isLive ? new Date() : new Date(time)}
            isLive={isLive}
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][0])}
            title={chartSelections[selectedScreen][0]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][0])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][0])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][0])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][0])] || []}
            onClick={handleChartClick}
            onNoteClick={(time: number) => {
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            onDataDemand={(time, direction) =>
              onDemand(
                biometricData[getIndex(chartSelections[selectedScreen][0])].biometricId,
                time,
                direction
              )
            }
            history={
              historicData[getIndex(chartSelections[selectedScreen][0])]
                ? historicData[getIndex(chartSelections[selectedScreen][0])].values
                : []
            }
          />
        )}
      </div>
      <div className="overflow-hidden">
        <div className="h-100 w-100 p-3 controls-box">
          <Routes>
            <Route path="/notes/*" element={<Notes />} />
            <Route path="/medications/*" element={<Medications />} />
            <Route path="/alarms/*" element={<Alarms />} />
            <Route path="/" element={<ChartSelector />} />
          </Routes>
        </div>
      </div>
      <div className="overflow-hidden">
        {chartSelections[selectedScreen] && chartSelections[selectedScreen][1] && (
          <Chart
            color={colors[1]}
            isLive={isLive}
            chartTime={isLive ? new Date() : new Date(time)}
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][1])}
            title={chartSelections[selectedScreen][1]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][1])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][1])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][1])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][1])] || []}
            onClick={handleChartClick}
            onNoteClick={(time: number) => {
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            onDataDemand={(time, direction) =>
              onDemand(
                biometricData[getIndex(chartSelections[selectedScreen][1])].biometricId,
                time,
                direction
              )
            }
            history={
              historicData[getIndex(chartSelections[selectedScreen][1])]
                ? historicData[getIndex(chartSelections[selectedScreen][1])].values
                : []
            }
          />
        )}
      </div>
      <div className="overflow-hidden">
        {chartSelections[selectedScreen] && chartSelections[selectedScreen][2] && (
          <Chart
            color={colors[2]}
            isLive={isLive}
            chartTime={isLive ? new Date() : new Date(time)}
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][2])}
            title={chartSelections[selectedScreen][2]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][2])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][2])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][2])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][2])] || []}
            onClick={handleChartClick}
            onNoteClick={(time: number) => {
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            onDataDemand={(time, direction) =>
              onDemand(
                biometricData[getIndex(chartSelections[selectedScreen][2])].biometricId,
                time,
                direction
              )
            }
            history={
              historicData[getIndex(chartSelections[selectedScreen][2])]
                ? historicData[getIndex(chartSelections[selectedScreen][2])].values
                : []
            }
          />
        )}
      </div>
    </div>
  );
};

export default BiometricCharts;
