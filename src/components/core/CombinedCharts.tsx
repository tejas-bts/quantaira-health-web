/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronsRight, FiChevronsLeft, FiClock } from 'react-icons/fi';
import {
  CombinedChartData,
  CombinedChartPropsType,
  SelectedChartItem,
} from '../../types/Chart.propsType';

import { isSameArray, localToTime, timeToLocal } from '../../utils/utilities';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ITimeScaleApi,
  LineStyle,
  Logical,
  LogicalRange,
  SeriesMarker,
  Time,
  // Time,
} from 'lightweight-charts';
import { debounce } from 'lodash';
import { Medication, Note } from '../../types/Core.types';
import { toast } from 'react-toastify';

const DEBUG = true;
const CHART_BACKGROUND_COLOR = '#02162c';
const GRID_COLOR = '#344456';
const LABEL_COLOR = '#888';

class Data {
  static isLive = true;
}

const Chart = ({
  combinedChartData,
  onDataDemand,
  notes,
  medications,
  onClick,
  onNoteClick,
  onMedicationClick,
}: CombinedChartPropsType) => {
  const [isLive] = useState(true);

  const [leftScroll] = useState(0);
  const [rightScroll] = useState(0);

  const [leftOffset, setLeftOffset] = useState<number>(0);

  const [chart, setChart] = useState<IChartApi | undefined>(undefined);
  const [selectedCharts, setSelectedCharts] = useState<Array<SelectedChartItem>>([]);

  const [timeScale, setTimeScale] = useState<ITimeScaleApi | undefined>(undefined);
  const [markerSeries, setMarkerSeries] = useState<ISeriesApi<'Histogram'> | undefined>(undefined);

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

  const debouncedDataDemand = debounce((timeStamp, direction) => {
    if (onDataDemand != undefined) {
      if (direction == 'to') onDataDemand(localToTime(timeStamp), 'to');
      if (direction == 'from') onDataDemand(localToTime(timeStamp), 'from');
    }
  }, 1000);

  const myClickHandler: any = (param: { point: any; time: any; hoveredMarkerId: any }) => {
    console.log('Clicked Params', param);
    if (!param.point) {
      return;
    }
    console.log('Here 2', onClick !== undefined && param.time != undefined);
    if (onClick !== undefined && param.time != undefined) {
      const targetTime = param.time;
      const markerId = param.hoveredMarkerId;

      console.log('Clicked Target Time', targetTime, markerId, param);

      if (markerId == undefined) {
        onClick(targetTime * 1000 + new Date().getTimezoneOffset() * 60 * 1000);
      } else if (markerId == 'medication') {
        const time = targetTime + new Date().getTimezoneOffset() * 60;
        const medication = medications?.find((item) => item.timeStamp == time);
        console.log('Medication Clicked', medications, medication);
        // toast(medication)
        onMedicationClick(medication);
      } else if (markerId == 'note') {
        const time = targetTime + new Date().getTimezoneOffset() * 60;
        const note = notes?.find((item) => item.timeStamp == time);
        console.log('Note Clicked', notes, note);
        onNoteClick(note);
        toast(note.note);
      }
    }
  };

  useEffect(() => {
    if (chart !== undefined) {
      chart.subscribeClick(myClickHandler);
    }
  }, [chart]);

  useEffect(() => {
    if (timeScale !== undefined) {
      const handleRangeChange = (e: LogicalRange | null) => {
        const scrolledDistance = timeScale.scrollPosition();
        if (e != null && scrolledDistance != null) {
          const { from, to }: { from: any; to: any } = e;

          const range = to - from;

          // if (to < range) {
          //   const co_ordinate = timeScale.logicalToCoordinate(0 as Logical);
          //   if (co_ordinate != null) {
          //     const time = timeScale.coordinateToTime(co_ordinate);
          //     if (onDataDemand != undefined && time != null) {
          //       debouncedDataDemand(time, 'to');
          //     }
          //   }
          // }
          if (scrolledDistance > 0) {
            const timeRange = timeScale.getVisibleRange();
            if (timeRange != null) {
              debouncedDataDemand(timeRange.to, 'from');
            }
          }
        }
      };
      timeScale.subscribeVisibleLogicalRangeChange(handleRangeChange);
      return () => {
        if (handleRangeChange != undefined) {
          timeScale.unsubscribeVisibleLogicalRangeChange(handleRangeChange);
        }
      };
    }
  }, [timeScale]);

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
      const markerSeries = chart.addHistogramSeries({
        color: 'transparent',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
        scaleMargins: {
          top: 0.5,
          bottom: 0.5,
        },
      });
      setTimeScale(timeScale);
      setMarkerSeries(markerSeries);
    }
  }, [chart]);

  useEffect(() => {
    if (markerSeries != undefined) {
      const markerPoints: SeriesMarker<Time>[] = [];
      const dataPoints = [];

      for (let i = 0; medications != undefined && i < medications.length; i++) {
        const item = medications[i];
        console.log('Item', item);
        dataPoints.push({ time: timeToLocal(item.timeStamp), value: 0, color: 'transparent' });
        markerPoints.push({
          id: 'medication',
          time: timeToLocal(item.timeStamp),
          color: 'red',
          position: 'aboveBar',
          shape: 'square',
          text: '💊 Medication',
          size: 2,
        });
      }

      for (let i = 0; notes != undefined && i < notes.length; i++) {
        const item = notes[i];
        console.log('Item', item);
        dataPoints.push({ time: timeToLocal(item.timeStamp), value: 0, color: 'transparent' });
        markerPoints.push({
          id: 'note',
          time: timeToLocal(item.timeStamp),
          color: 'green',
          position: 'belowBar',
          shape: 'circle',
          text: '📝 Notes',
          size: 2,
        });
      }

      console.log('Data and Marker Points', notes?.length, medications?.length);

      dataPoints.sort((a, b) => {
        return (a.time as number) - (b.time as number);
      });

      markerPoints.sort((a, b) => {
        return (a.time as number) - (b.time as number);
      });

      // markerSeries.setData(dataPoints);

      // markerSeries.setMarkers(markerPoints);

      console.log('Data and Marker Points', dataPoints, markerPoints);
    }
  }, [markerSeries, medications, notes]);

  useEffect(() => {
    // if (DEBUG) console.log('Combined Chart Data', combinedChartData);
    if (combinedChartData !== undefined && selectedCharts != undefined && chart != undefined) {
      combinedChartData
        .filter((combinedChartItem: CombinedChartData) => combinedChartItem.showOnchart)
        .map((combinedChartItem: CombinedChartData) => {
          const newValues = combinedChartItem.values;
          const targetIndex = selectedCharts.findIndex(
            (item) => item.title == combinedChartItem.title
          );
          // if (DEBUG) console.log('Combined Chart Data', 'index', targetIndex);
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
    if (DEBUG) console.log('New Selected Chart', selectedCharts);
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
        <div className="d-flex flex-row flex-wrap p-1">
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
              {/* <div className="chart-navigation">
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
              </div> */}
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
