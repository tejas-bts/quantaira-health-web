import React, { useEffect, useState } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import Dropdown from './../../components/core/Dropdown';

const ChartSelector = ({
  availableCharts,
  onChange,
  value,
}: {
  availableCharts: Array<string>;
  value?: Array<string>;
  onChange: any;
}) => {
  const [selectedCharts, setSelectedCharts] = useState<Array<string>>([...(value || [])]);

  const removeSelectedChart = (index: number) => {
    const newSelectedChart = [...selectedCharts];
    newSelectedChart.splice(index, 1);
    setSelectedCharts(newSelectedChart);
  };

  useEffect(() => {
    onChange(selectedCharts);
  }, [selectedCharts]);

  return (
    <div className="flex-1 w-100">
      <div className="chart-selector-container">
        <Dropdown
          options={availableCharts}
          onChange={(charts: [string]) => setSelectedCharts(charts)}
          selectedCharts={selectedCharts}
        />
        {selectedCharts && (
          <div className="selected-options">
            <div className="selection-container">
              {selectedCharts?.map((item: string, index: number) => (
                <div key={index}>
                  {item}
                  <span className="remove-button" onClick={() => removeSelectedChart(index)}>
                    <IoMdCloseCircle />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartSelector;
