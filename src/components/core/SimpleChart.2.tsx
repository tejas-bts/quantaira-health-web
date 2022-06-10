/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronsRight, FiChevronsLeft, FiZoomIn, FiZoomOut, FiClock } from 'react-icons/fi';
import { ChartPropsType } from '../../types/Chart.propsType';
import { debounce } from 'lodash';

import { isTimeInOrder, localToTime, timeToLocal } from '../../utils/utilities';
import {
  createChart,
  ISeriesApi,
  Time,
  LineStyle,
  ITimeScaleApi,
  SeriesMarker,
  IChartApi,
  IPriceLine,
  Logical,
  SingleValueData,
  WhitespaceData,
  SeriesDataItemTypeMap,
} from 'lightweight-charts';
import { Medication, Note } from '../../types/Core.types';
import MultiLingualLabel from './MultiLingualLabel';
import {
  handleScrollLeft,
  handleScrollRight,
  handleZoomIn,
  handleZoomOut,
} from '../../utils/chart-utils';
import { servicesVersion } from 'typescript';
import { minMaxLineOptions } from '../../utils/chart-options';
import { delayThreshold } from '../../utils/constants';

const CHART_BACKGROUND_COLOR = 'transparent'; //'#02162c';
const GRID_COLOR = '#344456';
const LABEL_COLOR = '#888';
const IDEAL_LINES_WIDTH: any = 1;

class StaticData {
  static isLive = true;
  static warning = false;
  static isLoading = false;
}

class MinMaxSeries {
  topSeries: ISeriesApi<'Baseline'> | null = null;
  bottomSeries: ISeriesApi<'Baseline'> | null = null;
  topLine: IPriceLine | null = null;
  bottomLine: IPriceLine | null = null;
  idealMin: number | undefined;
  idealMax: number | undefined;
  chart: IChartApi | undefined;

  setData = (data: (SingleValueData | WhitespaceData)[]): void => {
    if (this.topSeries !== null && this.bottomSeries !== null) {
      this.topSeries.setData(data);
      this.bottomSeries.setData(data);
    } else {
      throw new Error('Series is null');
    }
  };

  update = (data: { time: Time; value: number }): void => {
    if (this.topSeries !== null && this.bottomSeries !== null) {
      this.topSeries?.update(data);
      this.bottomSeries?.update(data);
    } else {
      throw new Error('Series is null');
    }
  };

  setMarkers = (markers: SeriesMarker<Time>[]): void => {
    if (this.topSeries !== null && this.bottomSeries !== null) {
      this.topSeries.setMarkers(markers);
      this.bottomSeries.setMarkers(markers);
    } else {
      throw new Error('Series is null');
    }
  };

  removeRangeLines = (): void => {
    if (this.topLine !== null) this.topSeries?.removePriceLine(this.topLine);
    if (this.bottomLine != null) this.bottomSeries?.removePriceLine(this.bottomLine);
  };

  removeSeries = (): void => {
    if (this.bottomSeries != undefined) this.chart?.removeSeries(this.bottomSeries);
    if (this.topSeries != undefined) this.chart?.removeSeries(this.topSeries);
  };

  addRangeLines = (idealMin?: number, idealMax?: number): void => {
    if (idealMax != undefined) {
      const maxLimitLineOptions = {
        ...minMaxLineOptions,
        price: idealMax,
        title: 'Max',
      };
      this.topLine = this.topSeries?.createPriceLine(maxLimitLineOptions) || null;
    }
    if (idealMin != undefined) {
      const minLimitLineOptions = {
        ...minMaxLineOptions,
        price: idealMin,
        title: 'Min',
      };
      this.bottomLine = this.bottomSeries?.createPriceLine(minLimitLineOptions) || null;
    }
  };

  constructor(chart: IChartApi, color: string, idealMin?: number, idealMax?: number) {
    console.log('Contructor called');
    this.chart = chart;
    this.idealMax = idealMax;
    this.idealMin = idealMin;
    this.topSeries = chart.addBaselineSeries({
      baseValue: { type: 'price', price: idealMax },
      topLineColor: 'orange',
      topFillColor1: 'transparent',
      topFillColor2: 'transparent',
      bottomLineColor: color,
      bottomFillColor1: 'transparent',
      bottomFillColor2: 'transparent',
      lastValueVisible: false,
      priceLineVisible: false,
    });

    this.bottomSeries = chart.addBaselineSeries({
      baseValue: { type: 'price', price: idealMin },
      topLineColor: 'transparent',
      topFillColor1: 'transparent',
      topFillColor2: 'transparent',
      bottomLineColor: 'red',
      bottomFillColor1: 'transparent',
      bottomFillColor2: 'transparent',
    });
  }
}

const Chart = ({
  title,
  color,
  Icon,
  idealMin,
  idealMax,
  unit,
  values,
  history,
  notes,
  medications,
  onClick,
  onNoteClick,
  onMedicationClick,
  onDataDemand,
  isLive,
}: ChartPropsType) => {
  const id = Math.random().toString().substr(2);

  const [leftScroll, setLeftScroll] = useState(false);
  const [rightScroll, setRightScroll] = useState(false);
  const [isChartShown, setChartShown] = useState(false);

  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  const [isScrolled, setScrolled] = useState(false);

  const [currentValue, setCurrentValue] = useState<number | undefined>(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [chart, setChart] = useState<IChartApi | undefined>(undefined);

  const [minMaxSeries, setSeries] = useState<MinMaxSeries | undefined>(undefined);

  const [timeScale, setTimeScale] = useState<ITimeScaleApi | undefined>(undefined);

  const [warning, setWarning] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const chartDiv = useRef<HTMLDivElement>(null);
  const chartContainer = useRef<HTMLDivElement>(null);

  const options = {
    rightPriceScale: {
      visible: false,
    },
    leftPriceScale: {
      visible: true,
    },
    lineColor: 'white',
    lineStyle: { color: 'rgba( 38, 166, 154, 1)' },
    timeScale: {
      visible: true,
      timeVisible: true,
    },
    layout: {
      backgroundColor: CHART_BACKGROUND_COLOR,
      textColor: LABEL_COLOR,
    },
    localisation: {
      dateFormat: 'hh:mm',
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

  const cleanUp = () => {
    setCurrentValue(undefined);
    setWarning(false);
    minMaxSeries?.removeRangeLines();
    // chart?.unsubscribeClick(myClickHandler);
  };

  const myClickHandler: any = (param: { point: any; time: any; hoveredMarkerId: any }) => {
    if (!param.point) {
      return;
    }
    if (onClick !== undefined && param.time != undefined) {
      const targetTime = param.time;
      const markerId = param.hoveredMarkerId;

      if (markerId == undefined) {
        onClick(targetTime * 1000 + new Date().getTimezoneOffset() * 60 * 1000);
      } else if (markerId == 'medication') {
        onMedicationClick(targetTime + new Date().getTimezoneOffset() * 60);
      } else if (markerId == 'note') {
        onNoteClick(targetTime + new Date().getTimezoneOffset() * 60);
      }
    }
  };

  // const getTargetDom = (): HTMLElement => {
  //   if (chartDiv != null && chartDiv.current != null) {
  //     return chartDiv.current;
  //   }
  // };

  const getChart = (): IChartApi => {
    if (chart == undefined) {
      console.log('getChart : : : Generating new Chart');
      const newChart = createChart(chartDiv!.current!, options);
      const handleResize = () => {
        if (chartDiv !== null && chartDiv.current != null) {
          newChart.applyOptions({
            width: chartDiv.current.clientWidth,
            height: chartDiv.current.clientHeight,
          });
        }
      };
      window.addEventListener('resize', handleResize);
      setChart(newChart);
      return newChart;
    } else {
      console.log('getChart : : : Providing old Chart');
    }
    return chart;
  };

  const getSeriesAndTimeScale = (): [MinMaxSeries, ITimeScaleApi] => {
    let series, scale;
    const chart = getChart();

    if (minMaxSeries == undefined) {
      console.log('getSeriesAndTimeScale : : : Generating new Series');
      const newMinMaxSeries = new MinMaxSeries(chart, color, idealMin, idealMax);
      setSeries(newMinMaxSeries);
      series = newMinMaxSeries;
    } else {
      console.log('getSeriesAndTimeScale : : : Using old Series');
      series = minMaxSeries;
    }

    if (timeScale == undefined) {
      console.log('getSeriesAndTimeScale : : : Generating new Scale');
      const newTimeScale = chart.timeScale();
      setTimeScale(newTimeScale);
      scale = newTimeScale;
    } else {
      console.log('getSeriesAndTimeScale : : : Using old Scale');
      scale = timeScale;
    }

    return [series, scale];
  };

  // useEffect(() => {
  //   let interval: NodeJS.Timer | undefined = undefined;
  //   const intervalTime = 5;
  //   const timeScale = getTimeScale();
  //   if (zoomOut) {
  //     interval = setInterval(() => {
  //       handleZoomOut(timeScale);
  //     }, intervalTime);
  //   } else if (zoomIn) {
  //     interval = setInterval(() => {
  //       handleZoomIn(timeScale);
  //     }, intervalTime);
  //   } else if (leftScroll) {
  //     interval = setInterval(() => {
  //       handleScrollLeft(timeScale);
  //     }, intervalTime);
  //   } else if (rightScroll) {
  //     interval = setInterval(() => {
  //       handleScrollRight(timeScale);
  //     }, intervalTime);
  //   }

  //   return () => {
  //     if (interval != undefined) clearInterval(interval);
  //   };
  // }, [zoomOut, zoomIn, leftScroll, rightScroll]);

  const debouncedDataDemand = debounce((timeStamp, direction) => {
    if (onDataDemand != undefined) {
      setLoading(true);
      if (direction == 'to')
        onDataDemand(localToTime(timeStamp), 'to').finally(() => setLoading(false));
      if (direction == 'from')
        onDataDemand(localToTime(timeStamp), 'from').finally(() => setLoading(false));
    }
  }, 1000);

  useEffect(() => {
    if (minMaxSeries != undefined) {
      minMaxSeries.addRangeLines(idealMax, idealMin);
    }
    return cleanUp;
  }, [idealMax, idealMin, minMaxSeries]);

  // useEffect(() => {
  //   if (chartDiv !== null && chartDiv.current != null) {
  //     const chart = createChart(chartDiv.current, options);
  //     const handleResize = () => {
  //       if (chartDiv !== null && chartDiv.current != null) {
  //         chart.applyOptions({
  //           width: chartDiv.current.clientWidth,
  //           height: chartDiv.current.clientHeight,
  //         });
  //       }
  //     };

  //     window.addEventListener('resize', handleResize);
  //     setChart(chart);
  //   }
  // }, [chartDiv]);

  useEffect(() => {
    if (chartDiv != null && chartDiv.current != null && history !== undefined) {
      const [series, scale] = getSeriesAndTimeScale();

      const newHistory: (SingleValueData | WhitespaceData)[] = [];
      for (const item of history) {
        const [timeStamp, value] = item;
        const time: Time = timeToLocal(timeStamp);
        newHistory.push({ time, value });
        setCurrentValue(value);
        setCurrentTime(new Date((time as number) * 1000));
        if (idealMax !== undefined && idealMin != undefined) {
          if (value < idealMin || value > idealMax) {
            setWarning(true);
          } else {
            setWarning(false);
          }
        }
      }
      series.setData(newHistory);

      scale.subscribeVisibleLogicalRangeChange((e) => {
        const scrolledDistance = scale.scrollPosition();

        if (e != null && scrolledDistance != null) {
          const { from, to }: { from: any; to: any } = e;

          const range = to - from;

          if (-scrolledDistance > range) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          if (to < range) {
            const co_ordinate = scale.logicalToCoordinate(0 as Logical);
            if (co_ordinate != null) {
              const time = scale.coordinateToTime(co_ordinate);
              if (onDataDemand != undefined && time != null) {
                debouncedDataDemand(time, 'to');
              }
            }
          }
          if (scrolledDistance > 0) {
            const timeRange = scale.getVisibleRange();
            if (timeRange != null && !StaticData.isLive) {
              debouncedDataDemand(timeRange.to, 'from');
            }
          }
        }
      });
      setChartShown(true);
    } else {
      setChartShown(false);
      setCurrentValue(undefined);
      setWarning(false);
    }
    if (history !== undefined && history.length == 0) {
      setWarning(false);
    }
  }, [chartDiv, history, idealMax, idealMin]);

  useEffect(() => {
    if (chart !== undefined) {
      chart.subscribeClick(myClickHandler);
    }
    return cleanUp;
  }, [chart]);

  // useEffect(() => {
  //   if (history != undefined && history.length > 0) {
  //     console.log('history', isTimeInOrder(history), history.length);
  //     const newTime = timeToLocal(history[0][0]);
  //     const oldestTime = buffer[0] ? buffer[0].time : Infinity;
  //     const newestTime = buffer.length > 0 ? buffer[buffer.length - 1] : -Infinity;

  //     if (StaticData.isLive) {
  //       if (newTime < oldestTime) {
  //         if (lineSeries != undefined && dummySeries != undefined) {
  //           const newHistory: (SingleValueData | WhitespaceData)[] = [];
  //           for (const item of history) {
  //             const [timeStamp, value] = item;
  //             const time: Time = timeToLocal(timeStamp);
  //             newHistory.push({ time, value });
  //           }
  //           lineSeries.setData(newHistory);
  //           dummySeries.setData(newHistory);
  //           setBuffer(newHistory);
  //         }
  //       } else {
  //         if (lineSeries != undefined && dummySeries != undefined) {
  //           const newHistory: (SingleValueData | WhitespaceData)[] = [];
  //           for (const item of history) {
  //             const [timeStamp, value] = item;
  //             const time: Time = timeToLocal(timeStamp);
  //             newHistory.push({ time, value });
  //             if (newestTime < time) lineSeries.update({ time, value });
  //             if (newestTime < time) dummySeries.update({ time, value });
  //           }
  //           setBuffer(newHistory);
  //         }
  //       }
  //     } else {
  //       const newHistory: (SingleValueData | WhitespaceData)[] = [];
  //       for (const item of history) {
  //         const [timeStamp, value] = item;
  //         const time: Time = timeToLocal(timeStamp);
  //         newHistory.push({ time, value });
  //       }
  //       if (lineSeries !== undefined && dummySeries != undefined) {
  //         lineSeries.setData(newHistory);
  //         dummySeries.setData(newHistory);
  //       }
  //     }
  //   }
  // }, [history]);

  // useEffect(() => {
  //   if (history != undefined && chartDiv != null) {
  //     const newHistory: (SingleValueData | WhitespaceData)[] = [];
  //     for (const item of history) {
  //       const [timeStamp, value] = item;
  //       const time: Time = timeToLocal(timeStamp);
  //       newHistory.push({ time, value });
  //       setCurrentValue(value);
  //     }
  //     const series = getMinMaxSeries();
  //     series.setData(newHistory);
  //   }
  // }, [history, chartDiv]);

  // useEffect(() => {
  //   StaticData.isLive = isLive;
  //   StaticData.warning = warning;
  //   StaticData.isLoading = isLoading;
  //   if (!isLive) {
  //     if (warningInterval != null) {
  //       setWarning(false);
  //       clearInterval(warningInterval);
  //     }
  //   }
  // }, [isLive, warning, isLoading]);

  // useEffect(() => {
  //   if (warning) {
  //     const interval = setInterval(() => {
  //       if (chartContainer.current != null) {
  //         if (chartContainer.current.style.filter == '') {
  //           chartContainer.current.style.filter = 'invert(1)';
  //         } else {
  //           chartContainer.current.style.filter = '';
  //         }
  //       }
  //       setWarningInterval(interval);
  //     }, 800);
  //   } else {
  //     if (warningInterval != null) clearInterval(warningInterval);
  //   }

  //   return () => {
  //     if (warningInterval != null) clearInterval(warningInterval);
  //     if (chartContainer.current != null) chartContainer.current.style.filter = '';
  //   };
  // }, [warning]);

  useEffect(() => {
    if (
      notes !== undefined &&
      timeScale !== undefined &&
      minMaxSeries !== undefined &&
      medications !== undefined
    ) {
      const notesMarkers: Array<SeriesMarker<Time>> = notes.reduce(
        (result: Array<SeriesMarker<Time>>, item: Note) => {
          const time: Time = timeToLocal(item.timeStamp);
          if (
            timeScale.timeToCoordinate(time) !== null &&
            result.find((item) => time == item.time) == undefined
          ) {
            result.push({
              id: 'note',
              time,
              color,
              position: 'belowBar',
              shape: 'circle',
              text: '📝 Note',
            });
          }
          return result;
        },
        []
      );

      const medicationMarkers: Array<SeriesMarker<Time>> = medications.reduce(
        (result: Array<SeriesMarker<Time>>, item: Medication) => {
          const time: Time = timeToLocal(item.timeStamp);
          if (
            timeScale.timeToCoordinate(time) !== null &&
            result.find((item) => time == item.time) == undefined
          ) {
            result.push({
              id: 'medication',
              time,
              color,
              position: 'aboveBar',
              shape: 'square',
              text: '💊 Medication',
            });
          }
          return result;
        },
        []
      );
      minMaxSeries.setMarkers([...medicationMarkers, ...notesMarkers]);
    }

    return cleanUp;
  }, [notes, medications, minMaxSeries, timeScale]);

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
      ref={chartContainer}
    >
      {timeScale !== undefined && (
        <div className="chart-header">
          <div className="chart-header-left">
            <div>
              <div className="chart-title" style={{ color }}>
                <Icon />
                <span>{title}</span>
              </div>
            </div>
            <div className="d-flex">
              <div className="chart-header-col-1">
                <div className="zoom-buttons">
                  <button
                    className={`mt-2 ${zoomIn ? 'is-active' : ''}`}
                    onMouseDown={() => setZoomIn(true)}
                    onMouseUp={() => setZoomIn(false)}
                    onClick={() => handleZoomIn(timeScale)}
                  >
                    <FiZoomIn />
                  </button>
                  <button
                    className={`mt-0 ${zoomOut ? 'is-active' : ''}`}
                    onMouseDown={() => setZoomOut(true)}
                    onMouseUp={() => setZoomOut(false)}
                    onClick={() => handleZoomOut(timeScale)}
                  >
                    <FiZoomOut />
                  </button>
                </div>
              </div>
              <div className="chart-header-col-2">
                <div className="chart-current-value" style={{ color }}>
                  {currentValue != undefined ? currentValue : '?'}
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
          <div className="chart-header-center">
            <div className="chart-header-col-4">
              {isLive ? (
                isScrolled ? (
                  <button
                    onClick={() => {
                      timeScale?.scrollToRealTime();
                      timeScale?.resetTimeScale();
                    }}
                    className="go-live-button chart-online-status"
                  >
                    Go Live
                  </button>
                ) : (new Date().getTime() - currentTime.getTime()) / 1000 > delayThreshold ? (
                  <div className="chart-online-status delayed">
                    <FiClock color="yellow" className="m-1" />
                    Delayed
                  </div>
                ) : (
                  <button className="go-live-button chart-online-status">Live</button>
                )
              ) : (
                'Past Data'
              )}
            </div>
          </div>
          <div className="chart-header-right">
            <div className="chart-header-col-5">
              <div className="chart-navigation">
                <button
                  className={`chart-navigation-button ${leftScroll ? 'is-active' : ''}`}
                  onClick={() => handleScrollLeft(timeScale)}
                  onMouseDown={() => setLeftScroll(true)}
                  onMouseUp={() => setLeftScroll(false)}
                >
                  <FiChevronsLeft />
                </button>
                <button
                  className={`chart-navigation-button ${rightScroll ? 'is-active' : ''}`}
                  onClick={() => handleScrollRight(timeScale)}
                  onMouseDown={() => setRightScroll(true)}
                  onMouseUp={() => setRightScroll(false)}
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`chart-container${warning && isLive ? ' warning' : ''}`} ref={chartDiv} />
    </div>
  );
};

export default Chart;
