import React, { useState, useEffect, useContext } from 'react';
import Chart from '../components/core/Chart';
import { GiLungs, GiHeartOrgan, GiMedicalThermometer } from 'react-icons/gi';
import { FaNotesMedical } from 'react-icons/fa';
import { BiPulse } from 'react-icons/bi';

import { BiometricData } from '../types/WebsocketData';
import ChartSelector from '../pages/control-panel/ChartSelector';
import { Route, Routes, To, useNavigate } from 'react-router-dom';
import Notes from '../pages/control-panel/Notes';
import Medications from '../pages/control-panel/Medications';
import Alarms from '../pages/control-panel/Alarms';
import AppContext from '../contexts/AppContext';
import { useSelector } from 'react-redux';

const Home = ({
  biometricData,
  onChartSelectionChange,
  medicationData,
}: {
  biometricData: BiometricData[];
  onChartSelectionChange?: any;
  medicationData: any;
}) => {
  const navigate = useNavigate();
  const vitalId = 1;
  const icons = [
    GiHeartOrgan,
    GiLungs,
    FaNotesMedical,
    GiMedicalThermometer,
    FaNotesMedical,
    BiPulse,
    FaNotesMedical,
  ];
  const colors = [
    '#94d699',
    '#e7d57d',
    '#c0f7ff',
    '#fff59d',
    '#FFAB91',
    '#CE93D8',
    '#80CBC4',
  ];

  const [bufferData, setBuffer] = useState<any>({});

  const { chartSelections } = useContext(AppContext);
  const [availableCharts, setAvailableCharts] = useState<any>([]);
  //   const [pageNumber, setPageNumber] = useState<number>(0);

  const navigateTo = (address: To) => {
    navigate(address, {
      replace: true,
    });
  };

  useEffect(() => {
    const availableCharts: any = [];
    biometricData.map((item: BiometricData) =>
      availableCharts.push(item.label)
    );
    setAvailableCharts(availableCharts);
    setBuffer(
      biometricData.map((item, index) => [
        ...(bufferData[index] || []),
        ...item.values,
      ])
    );
  }, [biometricData]);

  const getIndex = (label: string) => {
    const index = biometricData.findIndex((item) => item.label === label);
    return index;
  };

  const notes = useSelector((state: any) => state.notes.data);
  const medications = useSelector((state: any) => state.medications.data);

  const bed: any = useSelector((state: any) => state.patient.bed);
  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  return (
    <div className="chart-grid">
      <div>
        {chartSelections[0] && (
          <Chart
            color={colors[0]}
            curveType="smooth"
            Icon={icons[vitalId]}
            title={chartSelections[0]}
            unit={biometricData[getIndex(chartSelections[0])].unit ?? ''}
            idealMax={
              biometricData[getIndex(chartSelections[0])].idealMax ?? ''
            }
            idealMin={
              biometricData[getIndex(chartSelections[0])].idealMin ?? ''
            }
            values={bufferData[getIndex(chartSelections[0])] || []}
            onClick={(time: number) =>
              navigateTo(`/app/charts/medications/add/${time}`)
            }
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
            medicationData={medicationData}
          />
        )}
      </div>
      <div>
        <div className="h-100 w-100 p-3 controls-box">
          <Routes>
            <Route path="/notes/*" element={<Notes notes={notes} />} />
            <Route
              path="/medications/*"
              element={<Medications medicationData={medicationData} />}
            />
            <Route path="/alarms/*" element={<Alarms />} />
            <Route
              path="/"
              element={
                <ChartSelector
                  availableCharts={availableCharts}
                  onChange={onChartSelectionChange}
                  value={chartSelections}
                />
              }
            />
          </Routes>
        </div>
      </div>
      <div>
        {chartSelections[1] && (
          <Chart
            color={colors[1]}
            curveType="smooth"
            Icon={icons[vitalId]}
            title={chartSelections[1]}
            unit={biometricData[getIndex(chartSelections[1])].unit ?? ''}
            idealMax={
              biometricData[getIndex(chartSelections[1])].idealMax ?? ''
            }
            idealMin={
              biometricData[getIndex(chartSelections[1])].idealMin ?? ''
            }
            values={bufferData[getIndex(chartSelections[1])] || []}
            onClick={(time: number) =>
              navigateTo(`/app/charts/notes/add/${time}`)
            }
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
            medicationData={medicationData}
          />
        )}
      </div>
      <div>
        {chartSelections[2] && (
          <Chart
            color={colors[2]}
            curveType="smooth"
            Icon={icons[vitalId]}
            title={chartSelections[2]}
            unit={biometricData[getIndex(chartSelections[2])].unit ?? ''}
            idealMax={
              biometricData[getIndex(chartSelections[2])].idealMax ?? ''
            }
            idealMin={
              biometricData[getIndex(chartSelections[2])].idealMin ?? ''
            }
            values={bufferData[getIndex(chartSelections[2])] || []}
            onClick={(time: number) =>
              navigateTo(`/app/charts/notes/add/${time}`)
            }
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
            medicationData={medicationData}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
