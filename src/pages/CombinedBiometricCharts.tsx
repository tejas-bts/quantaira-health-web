/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaNotesMedical } from 'react-icons/fa';
import { GiHeartOrgan, GiZipper } from 'react-icons/gi';
import { IoMdCloseCircle } from 'react-icons/io';
import { useSelector, useDispatch } from 'react-redux';
import Chart from '../components/core/CombinedCharts';
import Dropdown from '../components/core/Dropdown';
import { addChartToScreen, removeChartFromScreen, selectScreen } from '../reducers/charts';
import { CombinedChartData } from '../types/Chart.propsType';
import { BiometricData } from '../types/WebsocketData';

import { colors } from '../utils/constants';

const CombinedBiometricCharts = () => {
  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);
  const biometricData: any = useSelector((state: any) => state.biometrics.biometricData);

  const [availableCharts, setAvailableCharts] = useState<Array<string>>([]);
  const [combinedData, setData] = useState<Array<CombinedChartData>>([]);

  const dispatch = useDispatch();

  const handleChartAddition = (chart: string) => {
    dispatch(addChartToScreen({ screen: selectedScreen, chart }));
  };
  const handleChartRemoval = (chart: string) => {
    dispatch(removeChartFromScreen({ screen: selectedScreen, chart }));
  };
  const handleScreenSelection = (screen: number) => {
    dispatch(selectScreen(screen));
  };

  const flattenArray = (twoDArray: Array<Array<string>>) => {
    const oneDArray = [];
    for (const arr of twoDArray) {
      for (const item of arr) {
        oneDArray.push(item);
      }
    }
    return oneDArray;
  };

  useEffect(() => {
    const availableCharts: any = [];
    biometricData.map((item: BiometricData) => availableCharts.push(item.label));
    setAvailableCharts(availableCharts);
  }, [biometricData]);

  useEffect(() => {
    const selectedCharts = flattenArray(chartSelections);
    const combinedBiometricData: Array<CombinedChartData> = biometricData.map(
      (biometricItem: BiometricData, index: number) => {
        const arrayItem: CombinedChartData = {
          title: biometricItem.label,
          color: colors[index % colors.length],
          Icon: FaNotesMedical,
          idealMin: biometricItem.idealMin,
          idealMax: biometricItem.idealMax,
          unit: biometricItem.unit,
          values: biometricItem.values,
          showOnchart: selectedCharts.includes(biometricItem.label),
        };
        return arrayItem;
      }
    );
    setData(combinedBiometricData);
  }, [chartSelections, biometricData]);

  useEffect(() => {
    const selectedCharts = flattenArray(chartSelections);
    console.log('Selected Charts', selectedCharts);
    console.log(
      selectedCharts
        .map((selectedChartLabel) =>
          biometricData.find((bio: { label: string }) => bio.label == selectedChartLabel)
        )
        .map((item) => {
          return {
            ...item,
            title: item.label,
            color: 'yellow',
            Icon: GiZipper,
            idealMin: item.idealMin,
            idealMax: 100,
            unit: 'unit2',
            values: item.values,
          };
        })
    );
  }, [chartSelections]);

  return (
    <div className="d-flex flex-column">
      <div className="w-100 p-3">
        <div className="chart-selector-container">
          <Dropdown
            options={availableCharts}
            onChartAdded={handleChartAddition}
            onChartRemoved={handleChartRemoval}
            selectedCharts={flattenArray(chartSelections)}
          />
        </div>
      </div>
      <div className="flex-1">
        <Chart combinedChartData={combinedData} />
      </div>
    </div>
  );
};

export default CombinedBiometricCharts;
