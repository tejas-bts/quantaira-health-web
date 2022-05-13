/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import Chart from '../components/core/SimpleChart';
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
import { localToTime, timeToLocal } from '../utils/utilities';
import { Time } from 'lightweight-charts';
// import { logBiometricData } from '../utils/logger';

const BiometricCharts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = ['#94d699', '#e7d57d', '#c0f7ff', '#fff59d', '#FFAB91', '#CE93D8', '#80CBC4'];

  const [bufferData, setBuffer] = useState<any>({});

  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);
  const bed: any = useSelector((state: any) => state.patient.bed);
  const notes = useSelector((state: any) => state.notes.data);
  const medications = useSelector((state: any) => state.medications.data);
  const biometricData: any = useSelector((state: any) => state.biometrics.biometricData);

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

  useEffect(() => {
    const availableCharts: any = [];
    biometricData.map((item: BiometricData) => availableCharts.push(item.label));
    setBuffer(biometricData.map((item: any) => item.values));
  }, [biometricData]);

  const getIndex = (label: string) => {
    const index = biometricData.findIndex((item: any) => item.label === label);
    return index;
  };

  const handleDataDemand = async (biometricId: any, time: number) => {
    try {
      const newData = await fetchPastChartData({
        bedId: bed.bedId,
        patientId: bed.patientID,
        fromDate: time,
        limit: 4,
        biometricId,
      });
      console.log('Data demanded fullfiled with', newData);
      dispatch(prependToBiometricData({ data: [newData] }));
    } catch (e) {
      console.log('Error fetching Past chart data', e);
    }
  };

  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  const [history, setHistory] = useState<Array<any>>([]);

  const onDemand = (biometricId: any, time: number) => {
    return new Promise<void>((resolve, reject) => {
      fetchPastChartData({
        bedId: bed.bedId,
        patientId: bed.patientID,
        fromDate: time,
        limit: 4,
        biometricId,
      })
        .then((data) => {
          const { values } = data;
          if (values != undefined && values.length > 0) {
            const newHistory: Array<[Time, number]> = [];
            for (const item of values) {
              const [timeStamp, value] = item;
              newHistory.push([timeToLocal(timeStamp), value]);
            }
            console.log('New History', newHistory);
            setHistory((oldHistory) => {
              if (oldHistory.length > 0) {
                if (oldHistory[0][0] > newHistory[newHistory.length - 1][0]) {
                  return [...newHistory, ...oldHistory];
                } else {
                  console.log('Final History', 'Order was incorrect', oldHistory, newHistory);
                  return oldHistory;
                }
              } else {
                return newHistory;
              }
            });
          }
        })
        .catch((e) => console.error(e));
    });

    // return new Promise<void>((resolve) => {
    //   console.log('new History', new Date(time));
    //   setTimeout(() => {
    //     const newHistory: Array<[number, number]> = [];
    //     for (let i = 0; i < 10; i++) {
    //       newHistory.push([
    //         Math.floor(time / 1000) - (10 - i),
    //         parseFloat(Math.random().toFixed(1)),
    //       ]);
    //       console.log('Target Time', [
    //         Math.floor(time / 1000) - (10 - i),
    //         Math.random().toFixed(1),
    //       ]);
    //     }
    //     setHistory((oldHistory) => {
    //       if (oldHistory.length > 0) {
    //         if (oldHistory[0][0] > newHistory[newHistory.length - 1][0]) {
    //           return [...newHistory, ...oldHistory];
    //         } else {
    //           return oldHistory;
    //         }
    //       } else {
    //         return newHistory;
    //       }
    //     });
    //     resolve();
    //   }, 500);
    // });
  };

  return (
    <div className="chart-grid">
      <div className="overflow-hidden">
        {chartSelections[selectedScreen] && chartSelections[selectedScreen][0] && (
          <Chart
            color={colors[0]}
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][0])}
            title={chartSelections[selectedScreen][0]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][0])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][0])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][0])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][0])] || []}
            onClick={(time: number) => navigateTo(`/app/charts/medications/add/${time}`)}
            onNoteClick={(time: number) => {
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            // onDataDemand={(time) => {
            //   handleDataDemand(
            //     biometricData[getIndex(chartSelections[selectedScreen][0])].biometricId,
            //     time
            //   );
            // }}
            onDataDemand={(time) => {
              console.log('Demand Time', time);
              return onDemand(
                biometricData[getIndex(chartSelections[selectedScreen][0])].biometricId,
                time
              );
            }}
            history={history}
          />
        )}
      </div>
      <div>
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
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][1])}
            title={chartSelections[selectedScreen][1]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][1])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][1])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][1])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][1])] || []}
            onClick={(time: number) => navigateTo(`/app/charts/notes/add/${time}`)}
            onNoteClick={(time: number) => {
              console.log('Note Clicked');
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              console.log('Medicine Clicked');
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            // onDataDemand={(time) =>
            //   handleDataDemand(
            //     biometricData[getIndex(chartSelections[selectedScreen][1])].biometricId,
            //     time
            //   )
            // }
            history={[]}
          />
        )}
      </div>
      <div className="overflow-hidden">
        {chartSelections[selectedScreen] && chartSelections[selectedScreen][2] && (
          <Chart
            color={colors[2]}
            curveType="smooth"
            Icon={getIcon(chartSelections[selectedScreen][2])}
            title={chartSelections[selectedScreen][2]}
            unit={biometricData[getIndex(chartSelections[selectedScreen][2])].unit ?? ''}
            idealMax={biometricData[getIndex(chartSelections[selectedScreen][2])].idealMax ?? ''}
            idealMin={biometricData[getIndex(chartSelections[selectedScreen][2])].idealMin ?? ''}
            values={bufferData[getIndex(chartSelections[selectedScreen][2])] || []}
            onClick={(time: number) => navigateTo(`/app/charts/notes/add/${time}`)}
            onNoteClick={(time: number) => {
              console.log('Note Clicked');
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              console.log('Medicine Clicked');
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
            // onDataDemand={(time) =>
            //   handleDataDemand(
            //     biometricData[getIndex(chartSelections[selectedScreen][2])].biometricId,
            //     time
            //   )
            // }
            history={[]}
          />
        )}
      </div>
    </div>
  );
};

export default BiometricCharts;
