import React from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { addChartToScreen, removeChartFromScreen, selectScreen } from '../../reducers/charts';
import Dropdown from './../../components/core/Dropdown';

const ChartSelector = ({ availableCharts }: { availableCharts: Array<string> }) => {
  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);

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

  return (
    <div className="flex-1 w-100">
      <div className="chart-selector-container">
        <Dropdown
          options={availableCharts}
          onChartAdded={handleChartAddition}
          onChartRemoved={handleChartRemoval}
          selectedCharts={flattenArray(chartSelections)}
        />

        <div className="selected-options">
          {chartSelections.length >= 1 &&
            chartSelections[0].length > 0 &&
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
