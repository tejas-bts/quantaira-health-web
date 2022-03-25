import React, { useState, useEffect } from 'react';
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
import { useSelector } from 'react-redux';

const BiometricCharts = () => {
  const navigate = useNavigate();
  const colors = ['#94d699', '#e7d57d', '#c0f7ff', '#fff59d', '#FFAB91', '#CE93D8', '#80CBC4'];

  const [bufferData, setBuffer] = useState<any>({});
  const [availableCharts, setAvailableCharts] = useState<any>([]);

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
    setAvailableCharts(availableCharts);
    setBuffer(
      biometricData.map((item: any, index: any) => [...(bufferData[index] || []), ...item.values])
    );
  }, [biometricData]);

  const getIndex = (label: string) => {
    const index = biometricData.findIndex((item: any) => item.label === label);
    return index;
  };

  if (!bed) {
    navigate('/app/patient', { replace: true });
  }

  return (
    <div className="chart-grid">
      <div>
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
              console.log('Note Clicked');
              navigateTo(`/app/charts/notes/view/${time}`);
            }}
            onMedicationClick={(time: number) => {
              console.log('Medicine Clicked');
              navigateTo(`/app/charts/medications/view/${time}`);
            }}
            notes={notes}
            medications={medications}
          />
        )}
      </div>
      <div>
        <div className="h-100 w-100 p-3 controls-box">
          <Routes>
            <Route path="/notes/*" element={<Notes />} />
            <Route path="/medications/*" element={<Medications />} />
            <Route path="/alarms/*" element={<Alarms />} />
            <Route path="/" element={<ChartSelector availableCharts={availableCharts} />} />
          </Routes>
        </div>
      </div>
      <div>
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
          />
        )}
      </div>
      <div>
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
          />
        )}
      </div>
    </div>
  );
};

export default BiometricCharts;
