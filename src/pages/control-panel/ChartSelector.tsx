import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { addChartToScreen, removeChartFromScreen, selectScreen } from '../../reducers/charts';
import { BiometricData } from '../../types/WebsocketData';
import Analytics from '../../utils/Analytics';
import Dropdown from './../../components/core/Dropdown';

const ChartSelector = () => {
  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);
  const biometricData: any = useSelector((state: any) => state.biometrics.biometricData);

  const [availableCharts, setAvailableCharts] = useState<Array<string>>([]);

  const dispatch = useDispatch();

  const handleChartAddition = (chart: string) => {
    Analytics.track('biometricaddedtowatchlist', `Added ${chart} on screen ${selectedScreen + 1}`);
    // console.warn('handleChartAddition :: Chart ', chart, selectedScreen + 1);
    dispatch(addChartToScreen({ screen: selectedScreen, chart }));
  };
  const handleChartRemoval = (chart: string) => {
    Analytics.track('biometricaddedtowatchlist', `Removed ${chart} from screen ${selectedScreen + 1}`);
    // console.warn('handleChartRemoval :: Remove ', chart);
    dispatch(removeChartFromScreen({ screen: selectedScreen, chart }));
  };
  const handleScreenSelection = (screen: number) => {
    Analytics.track('selectionviewchanged', `Switched to screen ${selectedScreen + 1}`);
    // console.warn('handleScreenSelection :: Screen ', screen + 1);
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

  const isArrayEmpty = (twoDArray: Array<Array<string>>) => {
    for (const arr of twoDArray) {
      // eslint-disable-next-line no-unused-vars
      for (const _i of arr) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    const availableCharts: any = [];
    biometricData.map((item: BiometricData) => availableCharts.push(item.label));
    setAvailableCharts(availableCharts);
  }, [biometricData]);

  return (
    <div className="flex-1 w-100 overflow-y-scroll quantaira-scroll-bar">
      <div className="chart-selector-container">
        <Dropdown
          options={availableCharts}
          onChartAdded={handleChartAddition}
          onChartRemoved={handleChartRemoval}
          selectedCharts={flattenArray(chartSelections)}
        />

        <div className="selected-options">
          {!isArrayEmpty(chartSelections) &&
            chartSelections.map(
              (screen: any[], index: number) =>
                screen.length > 0 && (
                  <div
                    key={index}
                    className={`selection-container ${selectedScreen === index ? 'selected' : ''}`}
                    onClick={() => handleScreenSelection(index)}
                  >
                    Screen {index + 1}
                    <div>
                      {screen.length > 0 &&
                        screen.map((chart: any, index: React.Key | null | undefined) => (
                          <div key={index}>
                            {chart}
                            <span
                              className="remove-button"
                              onClick={() => handleChartRemoval(chart)}
                            >
                              <IoMdCloseCircle />
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default ChartSelector;
