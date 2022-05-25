/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronsRight, FiChevronsLeft, FiClock } from 'react-icons/fi';
import {
  CombinedChartData,
  CombinedChartPropsType,
  SelectedChartItem,
} from '../../types/Chart.propsType';

import { isSameArray, timeToLocal } from '../../utils/utilities';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ITimeScaleApi,
  LineStyle,
  Time,
  // Time,
} from 'lightweight-charts';

const DEBUG = true;
const CHART_BACKGROUND_COLOR = '#02162c';
const GRID_COLOR = '#344456';
const LABEL_COLOR = '#888';

class Data {
  static isLive = true;
}

const Chart = ({ combinedChartData }: CombinedChartPropsType) => {
  const [isLive] = useState(true);

  const [leftScroll] = useState(0);
  const [rightScroll] = useState(0);

  const [leftOffset, setLeftOffset] = useState<number>(0);

  const [chart, setChart] = useState<IChartApi | undefined>(undefined);
  const [selectedCharts, setSelectedCharts] = useState<Array<SelectedChartItem>>([]);

  const [timeScale, setTimeScale] = useState<ITimeScaleApi | undefined>(undefined);

  const chartDiv = useRef<HTMLDivElement>(null);

  const options = {
    leftPriceScale: {
      visible: true,
    },
    lineColor: 'white',
    timeScale: {
      visible: true,
      timeVisible: true,
    },
    layout: {
      backgroundColor: CHART_BACKGROUND_COLOR,
      textColor: LABEL_COLOR,
    },
    grid: {
      vertLines: {
        visible: false,
      },
      horzLines: {
        color: GRID_COLOR,
        style: LineStyle.Dashed,
      },
    },
  };

  useEffect(() => {
    if (chartDiv != null && chartDiv.current != null) {
      const chart = createChart(chartDiv.current, options);
      setChart(chart);
      return () => chart.remove();
    }
  }, [chartDiv]);

  useEffect(() => {
    if (chart != undefined) {
      const timeScale = chart.timeScale();
      setTimeScale(timeScale);
    }
  }, [chart]);

  useEffect(() => {
    if (DEBUG) console.log('Combined Chart Data', combinedChartData);
    if (combinedChartData !== undefined && selectedCharts != undefined && chart != undefined) {
      combinedChartData
        .filter((combinedChartItem: CombinedChartData) => combinedChartItem.showOnchart)
        .map((combinedChartItem: CombinedChartData) => {
          const newValues = combinedChartItem.values;
          const targetIndex = selectedCharts.findIndex(
            (item) => item.title == combinedChartItem.title
          );
          if (DEBUG) console.log('Combined Chart Data', 'index', targetIndex);
          if (targetIndex < 0) {
            // Series does not Exist Create new
            const newSeries = chart.addLineSeries({ color: combinedChartItem.color });
            const newSelectedCharts: SelectedChartItem = {
              series: newSeries,
              chart: combinedChartItem,
              title: combinedChartItem.title,
            };
            if (DEBUG) console.log('New Series Generated', newSelectedCharts);
            setSelectedCharts((oldSelectedCharts) => [...oldSelectedCharts, newSelectedCharts]);
          } else {
            if (DEBUG) console.log(`Series ${targetIndex}`, selectedCharts[targetIndex]);
            const newSelectedCharts = [...selectedCharts];
            const newSelectedChartItem = newSelectedCharts[targetIndex];
            newSelectedChartItem.chart.values = [...newValues];
            newSelectedCharts[targetIndex] = newSelectedChartItem;
            setSelectedCharts(newSelectedCharts);
          }
        });
    }
  }, [combinedChartData, chart]);

  useEffect(() => {
    if (DEBUG) console.log('New SElected Chart', selectedCharts);
    selectedCharts.map((selectedChart) => {
      const series = selectedChart.series;
      const values = selectedChart.chart.values;
      for (const [timestamp, value] of values) {
        const time: Time = timeToLocal(timestamp);
        if (DEBUG) console.log('Time & Value', selectedChart.title, { time, value });
        series.update({ time, value });
      }
    });
  }, [selectedCharts]);

  useEffect(() => {
    Data.isLive = isLive;
  }, [isLive]);

  return (
    <div
      id="chart-container-div"
      className="chart-div"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: CHART_BACKGROUND_COLOR,
      }}
    >
      <div className="chart-header flex-column">
        <div className="d-flex flex-row flex-wrap">
          {combinedChartData &&
            combinedChartData
              .filter((item) => item.showOnchart)
              .map((item, index) => {
                const { Icon, color, idealMax, idealMin, unit } = item;
                return (
                  <div key={index}>
                    <div>
                      <div className="chart-title justify-content-end gap-1" style={{ color }}>
                        <Icon />
                        <span>{item.title}</span>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="chart-header-col-2">
                        <div className="chart-current-value" style={{ color }}>
                          {item.currentValue !== undefined ? item.currentValue : '?'}
                        </div>
                      </div>
                      <div className="chart-header-col-3">
                        <div className="chart-ideal-value">
                          <p className="m-0 font-weight-bold">{idealMax}</p>
                          <p className="mb-1 font-weight-bold">{idealMin}</p>
                          <p className="m-0" style={{ color }}>
                            {unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
        <div className="d-flex">
          {/* <div className="chart-header-center">
            <div className="chart-header-col-4">
              <div className="chart-online-status delayed">
                {leftOffset == 0 ? (
                  <>
                    <FiClock color="yellow" className="m-1" />
                    Delayed
                  </>
                ) : (
                  <button onClick={() => setLeftOffset(0)} className="go-live-button">
                    Go Live
                  </button>
                )}
              </div>
            </div>
          </div> */}
          <div className="chart-header-right">
            <div className="chart-header-col-5">
              <div className="chart-navigation">
                <button
                  className={`chart-navigation-button disabled${leftScroll > 0 ? 'is-active' : ''}`}
                >
                  <FiChevronsLeft />
                </button>
                <button
                  className={`chart-navigation-button disabled${
                    rightScroll > 0 ? 'is-active' : ''
                  }`}
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="chart-container" ref={chartDiv}>
        {/* {values.length ? (
          <div
            ref={chartDiv}
            className="chtoba"
            style={{ width: '100%', height: '250px', background: 'grey' }}
          />
        ) : (
          <div className="h-100 w-100 d-flex justify-content-center align-items-center">
            <MultiLingualLabel id="NO_DATA_AVAILABLE" />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Chart;
