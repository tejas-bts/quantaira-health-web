import React, { useState, useEffect, useRef } from 'react';
import { FiChevronsRight, FiChevronsLeft, FiZoomIn, FiZoomOut, FiClock } from 'react-icons/fi';
import { ChartPropsType } from '../../types/Chart.propsType';
import { debounce } from 'lodash';

import { localToTime, timeToLocal } from '../../utils/utilities';
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
} from 'lightweight-charts';
import { Medication, Note } from '../../types/Core.types';
import MultiLingualLabel from './MultiLingualLabel';

const CHART_BACKGROUND_COLOR = '#02162c';
const GRID_COLOR = '#344456';
const LABEL_COLOR = '#888';
const IDEAL_LINES_WIDTH: any = 1;

class StaticData {
  static isLive = true;
  static warning = false;
  static isLoading = false;
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
  const [leftScroll, setLeftScroll] = useState(false);
  const [rightScroll, setRightScroll] = useState(false);

  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  const [isScrolled, setScrolled] = useState(false);

  const [currentValue, setCurrentValue] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [chart, setChart] = useState<IChartApi | undefined>(undefined);
  const [lineSeries, setLineSeries] = useState<
    ISeriesApi<'Baseline'> | ISeriesApi<'Area'> | undefined
  >(undefined);
  const [dummySeries, setDummySeries] = useState<
    ISeriesApi<'Baseline'> | ISeriesApi<'Area'> | undefined
  >(undefined);
  const [timeScale, setTimeScale] = useState<ITimeScaleApi | undefined>(undefined);

  const [warning, setWarning] = useState(false);
  const [warningInterval, setWarningInterval] = useState<NodeJS.Timer | null>(null);

  const [isLoading, setLoading] = useState(false);

  const chartDiv = useRef<HTMLDivElement>(null);
  const chartContainer = useRef<HTMLDivElement>(null);

  const minMaxLineOptions = {
    color: '#be1238',
    lineWidth: IDEAL_LINES_WIDTH,
    lineStyle: LineStyle.LargeDashed,
    axisLabelVisible: true,
    lineVisible: true,
  };

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

  useEffect(() => {
    let interval: NodeJS.Timer | undefined = undefined;
    const intervalTime = 5;
    if (zoomOut) {
      interval = setInterval(() => {
        handleZoomOut();
      }, intervalTime);
    } else if (zoomIn) {
      interval = setInterval(() => {
        handleZoomIn();
      }, intervalTime);
    } else if (leftScroll) {
      interval = setInterval(() => {
        handleScrollLeft();
      }, intervalTime);
    } else if (rightScroll) {
      interval = setInterval(() => {
        handleScrollRight();
      }, intervalTime);
    }

    return () => {
      if (interval != undefined) clearInterval(interval);
    };
  }, [zoomOut, zoomIn, leftScroll, rightScroll]);

  const handleZoomOut = () => {
    if (timeScale != undefined) {
      const currentTimeScale = timeScale.getVisibleLogicalRange();
      if (currentTimeScale != null) {
        timeScale.setVisibleLogicalRange({
          from: currentTimeScale.from - 1,
          to: currentTimeScale.to + 1,
        });
        console.log('New Time Scale', {
          from: currentTimeScale.from - 1,
          to: currentTimeScale.to + 1,
        });
      }
    }
  };

  const handleZoomIn = () => {
    if (timeScale != undefined) {
      const currentTimeScale = timeScale.getVisibleLogicalRange();
      if (currentTimeScale != null) {
        timeScale.setVisibleLogicalRange({
          from: currentTimeScale.from + 1,
          to: currentTimeScale.to - 1,
        });
      }
    }
  };

  const handleScrollRight = () => {
    if (timeScale != undefined) {
      const currentTimeScale = timeScale.getVisibleLogicalRange();
      if (currentTimeScale != null) {
        timeScale.setVisibleLogicalRange({
          from: currentTimeScale.from - 1,
          to: currentTimeScale.to - 1,
        });
      }
    }
  };

  const handleScrollLeft = () => {
    if (timeScale != undefined) {
      const currentTimeScale = timeScale.getVisibleLogicalRange();
      if (currentTimeScale != null) {
        timeScale.setVisibleLogicalRange({
          from: currentTimeScale.from + 1,
          to: currentTimeScale.to + 1,
        });
      }
    }
  };

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
    if (chartDiv !== null && chartDiv.current != null) {
      const chart = createChart(chartDiv.current, options);
      const handleResize = () => {
        if (chartDiv !== null && chartDiv.current != null) {
          chart.applyOptions({
            width: chartDiv.current.clientWidth,
            height: chartDiv.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);
      setChart(chart);
    }
  }, [chartDiv]);

  useEffect(() => {
    if (chart !== undefined) {
      chart.subscribeClick(myClickHandler);
      const timeScale = chart.timeScale();

      timeScale.subscribeVisibleLogicalRangeChange((e) => {
        const scrolledDistance = timeScale.scrollPosition();

        if (e != null && scrolledDistance != null) {
          const { from, to }: { from: any; to: any } = e;

          const range = to - from;

          if (-scrolledDistance > range) {
            setScrolled(true);
          } else {
            setScrolled(false);
          }
          if (to < range) {
            const co_ordinate = timeScale.logicalToCoordinate(0 as Logical);
            if (co_ordinate != null) {
              const time = timeScale.coordinateToTime(co_ordinate);
              if (onDataDemand != undefined && time != null) {
                debouncedDataDemand(time, 'to');
              }
            }
          }
          if (scrolledDistance > 0) {
            const timeRange = timeScale.getVisibleRange();
            if (timeRange != null && !StaticData.isLive) {
              debouncedDataDemand(timeRange.to, 'from');
            }
          }
        }
      });

      if (lineSeries === undefined) {
        const lineSeries = chart.addBaselineSeries({
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
        setLineSeries(lineSeries);
      }

      if (dummySeries === undefined) {
        const dummySeries = chart.addBaselineSeries({
          baseValue: { type: 'price', price: idealMin },
          topLineColor: 'transparent',
          topFillColor1: 'transparent',
          topFillColor2: 'transparent',
          bottomLineColor: 'red',
          bottomFillColor1: 'transparent',
          bottomFillColor2: 'transparent',
        });
        setDummySeries(dummySeries);
      }

      setTimeScale(timeScale);
    }

    return () => {
      if (chart != undefined && lineSeries != undefined && dummySeries != undefined) {
        console.log('Resetting Data');
        lineSeries.setData([]);
        dummySeries.setData([]);
        chart.removeSeries(lineSeries);
        chart.removeSeries(dummySeries);
        setLineSeries(undefined);
        setDummySeries(undefined);
      }
    };
  }, [chart]);

  useEffect(() => {
    const newBuffer: Array<SingleValueData> = [];
    let maxLimitLine: IPriceLine | undefined = undefined;
    let minLimitLine: IPriceLine | undefined = undefined;

    if (lineSeries !== undefined && dummySeries != undefined) {
      for (const item of values) {
        const [time, value] = item;
        const zoneTime: Time = timeToLocal(time);
        if (StaticData.isLive) {
          //   lineSeries.update({ time: zoneTime, value });
          //   dummySeries.update({ time: zoneTime, value });
          setCurrentValue(value);
          setCurrentTime(new Date(time * 1000));
          if (idealMax !== undefined && idealMin != undefined) {
            if (value < idealMin || value > idealMax) {
              setWarning(true);
            } else {
              setWarning(false);
            }
          }
        }
        newBuffer.push({ time: zoneTime, value });
      }

      if (idealMax !== undefined) {
        const maxLimitLineOptions = {
          ...minMaxLineOptions,
          price: idealMax,
          title: 'Max',
        };
        maxLimitLine = lineSeries.createPriceLine(maxLimitLineOptions);
      }

      if (idealMin !== undefined) {
        const minLimitLineOptions = {
          ...minMaxLineOptions,
          price: idealMin,
          title: 'Min',
        };
        minLimitLine = lineSeries.createPriceLine(minLimitLineOptions);
      }
    }

    return () => {
      if (lineSeries != undefined && dummySeries != undefined) {
        if (maxLimitLine != undefined) lineSeries.removePriceLine(maxLimitLine);
        if (minLimitLine != undefined) lineSeries.removePriceLine(minLimitLine);
      }
    };
  }, [values, idealMin, idealMax]);

  useEffect(() => {
    // if (history != undefined && history.length > 0) {
    //   const newTime = timeToLocal(history[0][0]);
    //   const oldestTime = buffer[0] ? buffer[0].time : Infinity;
    //   const newestTime = buffer.length > 0 ? buffer[buffer.length - 1] : -Infinity;

    //   if (StaticData.isLive) {
    //     if (newTime < oldestTime) {
    //       if (lineSeries != undefined && dummySeries != undefined) {
    //         const newHistory: (SingleValueData | WhitespaceData)[] = [];
    //         for (const item of history) {
    //           const [timeStamp, value] = item;
    //           const time: Time = timeToLocal(timeStamp);
    //           newHistory.push({ time, value });
    //         }
    //         lineSeries.setData(newHistory);
    //         dummySeries.setData(newHistory);
    //         setBuffer(newHistory);
    //       }
    //     } else {
    //       if (lineSeries != undefined && dummySeries != undefined) {
    //         const newHistory: (SingleValueData | WhitespaceData)[] = [];
    //         for (const item of history) {
    //           const [timeStamp, value] = item;
    //           const time: Time = timeToLocal(timeStamp);
    //           newHistory.push({ time, value });
    //           if (newestTime < time) lineSeries.update({ time, value });
    //           if (newestTime < time) dummySeries.update({ time, value });
    //         }
    //         setBuffer(newHistory);
    //       }
    //     }
    //   } else {
    //     const newHistory: (SingleValueData | WhitespaceData)[] = [];
    //     for (const item of history) {
    //       const [timeStamp, value] = item;
    //       const time: Time = timeToLocal(timeStamp);
    //       newHistory.push({ time, value });
    //     }
    //     if (lineSeries !== undefined && dummySeries != undefined) {
    //       lineSeries.setData(newHistory);
    //       dummySeries.setData(newHistory);
    //     }
    //   }
    // }

    if (history != undefined && history.length > 0) {
      const newHistory: (SingleValueData | WhitespaceData)[] = [];
      for (const item of history) {
        const [timeStamp, value] = item;
        const time: Time = timeToLocal(timeStamp);
        newHistory.push({ time, value });
      }
      if (lineSeries !== undefined && dummySeries != undefined) {
        lineSeries.setData(newHistory);
        dummySeries.setData(newHistory);
      }
    }
  }, [history, lineSeries, dummySeries]);

  useEffect(() => {
    StaticData.isLive = isLive;
    StaticData.warning = warning;
    StaticData.isLoading = isLoading;
    if (!isLive) {
      if (warningInterval != null) {
        setWarning(false);
        clearInterval(warningInterval);
      }
    }
  }, [isLive, warning, isLoading]);

  useEffect(() => {
    if (warning) {
      const interval = setInterval(() => {
        if (chartContainer.current != null) {
          if (chartContainer.current.style.filter == '') {
            chartContainer.current.style.filter = 'invert(1)';
          } else {
            chartContainer.current.style.filter = '';
          }
        }
        setWarningInterval(interval);
      }, 800);
    } else {
      if (warningInterval != null) clearInterval(warningInterval);
    }

    return () => {
      if (warningInterval != null) clearInterval(warningInterval);
      if (chartContainer.current != null) chartContainer.current.style.filter = '';
    };
  }, [warning]);

  useEffect(() => {
    if (
      notes !== undefined &&
      timeScale !== undefined &&
      lineSeries !== undefined &&
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
      lineSeries.setMarkers([...medicationMarkers, ...notesMarkers]);
    }

    return () => {
      lineSeries?.setMarkers([]);
    };
  }, [notes, medications, lineSeries, timeScale]);

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
                  onClick={handleZoomIn}
                >
                  <FiZoomIn />
                </button>
                <button
                  className={`mt-0 ${zoomOut ? 'is-active' : ''}`}
                  onMouseDown={() => setZoomOut(true)}
                  onMouseUp={() => setZoomOut(false)}
                  onClick={handleZoomOut}
                >
                  <FiZoomOut />
                </button>
              </div>
            </div>
            <div className="chart-header-col-2">
              <div className="chart-current-value" style={{ color }}>
                {values.length > 0 ? currentValue : '?'}
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
              ) : (new Date().getTime() - currentTime.getTime()) / 1000 > 20 ? (
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
                onClick={handleScrollLeft}
                onMouseDown={() => setLeftScroll(true)}
                onMouseUp={() => setLeftScroll(false)}
              >
                <FiChevronsLeft />
              </button>
              <button
                className={`chart-navigation-button ${rightScroll ? 'is-active' : ''}`}
                onClick={handleScrollRight}
                onMouseDown={() => setRightScroll(true)}
                onMouseUp={() => setRightScroll(false)}
              >
                <FiChevronsRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      {values.length || (history != undefined && history.length) ? (
        <div className="chart-container" ref={chartDiv} />
      ) : (
        <div className="h-100 w-100 d-flex justify-content-center align-items-center">
          <MultiLingualLabel id="NO_DATA_AVAILABLE" />
        </div>
      )}
    </div>
  );
};

export default Chart;
