/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { FiChevronsRight, FiChevronsLeft, FiZoomIn, FiZoomOut, FiClock } from 'react-icons/fi';
import { ChartPropsType } from '../../types/Chart.propsType';

import { timeToLocal } from '../../utils/utilities';
import {
  createChart,
  ISeriesApi,
  Time,
  LineStyle,
  ITimeScaleApi,
  SeriesMarker,
  IChartApi,
  IPriceLine,
  TimeRange,
} from 'lightweight-charts';
import { Medication, Note } from '../../types/Core.types';

const leftOffset = 0;

const MAX_ZOOM_LEVEL = 200;
const MIN_ZOOM_LEVEL = 4;
const CHART_BACKGROUND_COLOR = '#02162c';
const GRID_COLOR = '#344456';
const LABEL_COLOR = '#888';

class Data {
  static isLive = true;
}

const Chart = ({
  title,
  color,
  Icon,
  idealMin,
  idealMax,
  unit,
  values,
  notes,
  medications,
  onClick,
  onNoteClick,
  onMedicationClick,
}: ChartPropsType) => {
  const [isLive, setLive] = useState(false);

  const [leftScroll] = useState(0);
  const [rightScroll, setRightScroll] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  const [currentValue, setCurrentValue] = useState(0);
  const [chart, setChart] = useState<IChartApi | undefined>(undefined);
  const [lineSeries, setLineSeries] = useState<ISeriesApi<'Area'> | undefined>(undefined);
  const [timeScale, setTimeScale] = useState<ITimeScaleApi | undefined>(undefined);

  const target = useRef<HTMLDivElement>(null);
  const chartDiv = useRef<HTMLDivElement>(null);

  const options = {
    rightPriceScale: {
      visible: false,
    },
    leftPriceScale: {
      visible: true,
    },
    lineColor: 'white',
    lineStyle: { color: 'red' },
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

      return () => {
        chart.remove();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [chartDiv]);

  useEffect(() => {
    if (chart !== undefined) {
      chart.subscribeClick(myClickHandler);
      const timeScale = chart.timeScale();

      timeScale.subscribeVisibleLogicalRangeChange((e) => {
        if (e != null) {
          const { from, to }: { from: any; to: any } = e;
          if (to < 5) {
            console.log('Demand more Data');
          }
          // const difference = to - from;

          console.log('Visible Logical Change', e, to - from); //from, to, difference);
        }
      });

      timeScale.subscribeVisibleTimeRangeChange((e) => {
        if (e != null) {
          // const { from, to }: { from: any; to: any } = e;
          // const difference = to - from;

          console.log('Visible Time Change', e); //from, to, difference);
        }
      });

      timeScale.applyOptions({});
      const lineSeries = chart.addAreaSeries({
        lineColor: color,
        topColor: color,
        bottomColor: 'transparent',
      });

      const lineWidth: any = 1;

      if (idealMax !== undefined) {
        const maxLimitLine: any = {
          price: idealMax,
          color: '#be1238',
          lineWidth: lineWidth,
          lineStyle: LineStyle.LargeDashed,
          axisLabelVisible: true,
          title: 'Upper limit',
          lineVisible: true,
        };
        lineSeries.createPriceLine(maxLimitLine);
      }

      if (idealMin !== undefined) {
        const minLimitLine: any = {
          price: idealMin,
          color: '#be1238',
          lineWidth: lineWidth,
          lineStyle: LineStyle.LargeDashed,
          axisLabelVisible: true,
          title: 'Lower limit',
          lineVisible: true,
        };
        lineSeries.createPriceLine(minLimitLine);
      }

      setTimeScale(timeScale);
      setLineSeries(lineSeries);
    }
  }, [chart]);

  useEffect(() => {
    if (timeScale !== undefined) {
      console.log('Time Scale', timeScale.getVisibleLogicalRange(), timeScale.getVisibleRange());
    }
  }, [timeScale]);

  useEffect(() => {
    if (lineSeries !== undefined) {
      console.log('Values', values);
      for (const item of values) {
        const [time, value] = item;
        const zoneTime: Time = timeToLocal(time);
        lineSeries.update({ time: zoneTime, value });
        setCurrentValue(value);
      }
    }
  }, [values]);

  useEffect(() => {
    Data.isLive = isLive;
  }, [isLive]);

  useEffect(() => {
    if (
      notes !== undefined &&
      timeScale !== undefined &&
      lineSeries !== undefined &&
      medications !== undefined
    ) {
      console.log('Notes & Medications', notes, medications);

      const notesMarkers: Array<SeriesMarker<Time>> = notes.reduce(
        (result: Array<SeriesMarker<Time>>, item: Note) => {
          const time: Time = timeToLocal(item.timeStamp);
          console.log('Is in Graph Note', timeScale.timeToCoordinate(time) !== null);
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
          console.log('Notes & Medications : Out of Chart');
          return result;
        },
        []
      );

      const medicationMarkers: Array<SeriesMarker<Time>> = medications.reduce(
        (result: Array<SeriesMarker<Time>>, item: Medication) => {
          const time: Time = timeToLocal(item.timeStamp);

          console.log('Is in Graph Med', timeScale.timeToCoordinate(time) !== null);
          if (
            timeScale.timeToCoordinate(time) !== null &&
            result.find((item) => time == item.time) == undefined
          ) {
            result.push({
              id: 'medication',
              time,
              color,
              position: 'aboveBar',
              shape: 'circle',
              text: '💊 Medication',
            });
          }
          console.log('Notes & Medications : Out of Chart');
          return result;
        },
        []
      );

      console.log('Notes & Medications', notesMarkers, medicationMarkers);

      lineSeries.setMarkers([...medicationMarkers, ...notesMarkers]);
    }

    return () => {
      lineSeries?.setMarkers([]);
      // lineSeries?.removePriceLine(minPriceLine);
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
                  className={`mt-2 ${zoomIn ? 'is-active' : ''} ${
                    zoomLevel <= MIN_ZOOM_LEVEL ? 'disabled' : ''
                  }`}
                  onMouseDown={() => setZoomIn(true)}
                  onMouseUp={() => setZoomIn(false)}
                >
                  <FiZoomIn />
                </button>
                <button
                  className={`mt-0 ${zoomOut ? 'is-active' : ''} ${
                    zoomLevel >= MAX_ZOOM_LEVEL ? 'disabled' : ''
                  }`}
                  onMouseDown={() => setZoomOut(true)}
                  onMouseUp={() => setZoomOut(false)}
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
              <div className="chart-online-status delayed">
                <FiClock color="yellow" className="m-1" />
                Delayed
              </div>
            ) : (
              // <div className="chart-online-status delayed">
              <button
                onClick={() => timeScale?.scrollToRealTime()}
                className="go-live-button chart-online-status"
              >
                Go Live
              </button>
              // </div>
            )}
          </div>
        </div>
        <div className="chart-header-right">
          <div className="chart-header-col-5">
            <div className="chart-navigation">
              <button
                className={`chart-navigation-button ${leftScroll > 0 ? 'is-active' : ''} ${
                  values.length - leftOffset < zoomLevel ? 'disabled' : ''
                }`}
              >
                <FiChevronsLeft />
              </button>
              <button
                className={`chart-navigation-button ${rightScroll > 0 ? 'is-active' : ''} ${
                  leftOffset == 0 ? 'disabled' : ''
                }`}
              >
                <FiChevronsRight />
              </button>
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
