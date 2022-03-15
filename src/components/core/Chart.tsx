/* eslint-disable no-unused-vars */
import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ApexChart from 'react-apexcharts';
import {
  FiChevronsRight,
  FiChevronsLeft,
  FiZoomIn,
  FiZoomOut,
  FiClock,
} from 'react-icons/fi';
import { useGesture } from '@use-gesture/react';
import { ChartPropsType } from '../../types/Chart.propsType';
import { ApexChartData } from '../../types/ChartAttributes';
import { FaLightbulb } from 'react-icons/fa';

const ADDING_DATA_INTERVAL_IN_SECONDS = 1000;
const MAX_ZOOM_LEVEL = 200;
const MIN_ZOOM_LEVEL = 4;
const CHART_BACKGROUND_COLOR = '#02162c';

class Data {
  static isLive = true;
}

const Chart = ({
  title,
  color,
  Icon,
  curveType,
  idealMin,
  idealMax,
  unit,
  values,
  notesAndMedicationData,
  onClick,
}: ChartPropsType) => {
  const [isLive, setLive] = useState(true);
  const [chartHeight] = useState(180);
  const [chartWidth, setWidth] = useState<number>(0);

  const [leftScroll] = useState(0);
  const [rightScroll, setRightScroll] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [leftOffset, setLeftOffset] = useState(0);
  const [zoomIn, setZoomIn] = useState(false);
  const [zoomOut, setZoomOut] = useState(false);

  const [currentValue, setCurrentValue] = useState(0);
  const [dataFrame, setDataFrame] = useState<Array<ApexChartData>>([]);

  const target = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // console.log('Chart Props', title, values);
  }, [values, title]);

  const zoomStep = 4;

  const onClicker = (e?: any) => {
    console.log('Hi There', e);
  };

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    chart: {
      redrawOnParentResize: true,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 4 * ADDING_DATA_INTERVAL_IN_SECONDS,
        dynamicAnimation: {
          enabled: true,
          speed: ADDING_DATA_INTERVAL_IN_SECONDS,
        },
      },
      zoom: {
        enabled: false,
      },
      events: {
        click: onClicker,
        //  function (event, chartContext, config) {
        //   console.log('Event Click');
        //   if (onClick) onClick(dataFrame[0].data[config.dataPointIndex][0]);
        // },

        beforeZoom: (e) => {
          console.log('EVENT : Before zoom', e);
          setLive(false);
        },
        zoomed: (e) => {
          console.log('EVENT : Zoomed', e);
          setLive(false);
        },
        beforeResetZoom: () => console.log('EVENT : Zoom Reset'),
        scrolled: () => setLive(false),
      },
    },
    markers: {
      discrete: [
        {
          seriesIndex: 10,
          dataPointIndex: 7,
          fillColor: 'red',
          strokeColor: '#fff',
          size: 50,
          shape: 'circle',
        },
      ],
      size: 2,
      strokeWidth: 2,
      // onClick: (e) => console.log('Hello', e),
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: curveType,
      colors: [color],
      show: true,
      lineCap: 'square',
      width: [5, 0],
    },
    fill: {
      colors: [color],
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100, 100, 100],
      },
    },
    grid: {
      borderColor: '#fff',
      strokeDashArray: 7,
      row: {
        opacity: 1,
        colors: [CHART_BACKGROUND_COLOR],
      },
      column: {
        colors: [CHART_BACKGROUND_COLOR],
      },
    },
    tooltip: {
      // followCursor: true,
      // shared: false,
      // intersect: true,
      shared: false,
      intersect: true,
      theme: 'dark',
      x: {
        format: 'yyyy/MM/dd hh:mm:ss',
      },
      // y: {
      //   format:
      // }
    },
    xaxis: {
      type: 'datetime',
      decimalsInFloat: 0,
      range: zoomLevel * 1000,
      labels: {
        offsetX: 50,
        format: 'hh:mm:ss',
        datetimeUTC: false,
        style: {
          colors: '#fff',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          colors: '#fff',
        },
      },
    },
  };

  const handleRightStart = () => {
    setRightScroll(1);
  };
  const handleRightStop = () => {
    setRightScroll(0);
  };

  const handleZoomIn = () => {
    setZoomLevel((zoomLevel) => {
      if (zoomLevel > zoomStep) return zoomLevel - zoomStep;
      else return zoomStep;
    });
  };

  const handleMoveLeft = () => {
    if (values.length - leftOffset < zoomLevel) return;
    setLeftOffset((offset: number) =>
      Math.min(Math.ceil(1.1 * (offset || 1)), values.length)
    );
  };

  const handleMoveRight = () => {
    setLeftOffset((offset: number) => Math.max(Math.floor(0.9 * offset), 0));
  };

  const handleMoveLeftLinear = () => {
    if (values.length - leftOffset < zoomLevel) return;
    setLeftOffset((offset: number) => Math.min(1 + offset, values.length));
  };

  const handleMoveRightLinear = () => {
    setLeftOffset((offset: number) => Math.max(offset - 1, 0));
  };

  const handleZoomOut = () => {
    if (zoomLevel < MAX_ZOOM_LEVEL)
      setZoomLevel((zoomLevel) => zoomLevel + zoomStep);
  };

  useEffect(() => {
    console.log('Notes and Medics', notesAndMedicationData);
    if (values.length) {
      /*
       *     Variable "values" holds the data coming from props
       *     We take a sliding window out of "values" into "dataFrame" and pass it to chart.
       *     The length of sliding window depends on the zoomLevel and length of "values" array.
       *     We adjust the "start" and "end" of sliding window depending on leftOffset, which is updated by navigation buttons.
       */

      if (values.length) {
        setCurrentValue(values[values.length - 1][1]);

        const length = 200; //Math.max(zoomLevel, 20); // 1 Hour of data
        const end = values.length - leftOffset;
        const start = Math.max(0, end - length);

        setDataFrame([
          {
            name: title,
            data: values.slice(start, end),
          },
        ]);
      }
    }
  }, [values, leftOffset, zoomLevel]);

  useEffect(() => {
    Data.isLive = isLive;
  }, [isLive]);

  useEffect(() => {
    if (!!target && target.current) {
      // setHeight(target.current.offsetHeight - 10);
      setWidth(target.current.offsetWidth);
    }
  }, [target]);

  useLayoutEffect(() => {
    if (!!target && target.current) {
      setWidth(target.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (zoomIn) {
      const interval = setInterval(() => {
        clearInterval(interval);
      }, 1000);
    }
  }, [zoomIn]);

  useGesture(
    {
      onScroll: ({ event, direction: [dx, dy] }) => {
        // event.preventDefault();
        if (dx || dy) {
          console.log('Scroll', dx, dy);
        }
      },
      onDrag: ({ event, offset: [x], direction: [dx] }) => {
        setLeftOffset(x);
        // event.preventDefault();
        if (dx) {
          if (dx) {
            if (dx < 0) handleMoveRightLinear();
            if (dx > 0) handleMoveLeftLinear();
          }
        }
      },
      onPinch: ({ offset: [d] }) => {
        setZoomLevel(d);
        // console.log("Pinch ", d);
      },
      onWheel: ({ event, direction: [dx, dy] }) => {
        // event.preventDefault();
        if (dy) {
          if (dy < 0) {
            handleZoomIn();
          } else {
            handleZoomOut();
          }
        }
        if (dx) {
          if (dx > 0) handleMoveRight();
          if (dx < 0) handleMoveLeft();
        }
      },
    },
    {
      target,
      // eventOptions: {
      //   // passive: false,
      // },
      pinch: { scaleBounds: { min: MIN_ZOOM_LEVEL, max: MAX_ZOOM_LEVEL } },
      // drag: { bounds: { left: values.length, right: 0 } },
    }
  );

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
                  onClick={handleZoomIn}
                  onMouseDown={() => setZoomIn(true)}
                  onMouseUp={() => setZoomIn(false)}
                >
                  <FiZoomIn />
                </button>
                <button
                  className={`mt-0 ${zoomOut ? 'is-active' : ''} ${
                    zoomLevel >= MAX_ZOOM_LEVEL ? 'disabled' : ''
                  }`}
                  onClick={handleZoomOut}
                  onMouseDown={() => setZoomOut(true)}
                  onMouseUp={() => setZoomOut(false)}
                >
                  <FiZoomOut />
                </button>
              </div>
            </div>
            <div className="chart-header-col-2">
              <div className="chart-current-value" style={{ color }}>
                {currentValue}
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
            <div className="chart-online-status delayed">
              {leftOffset == 0 ? (
                <>
                  {' '}
                  <FiClock color="yellow" className="m-1" />
                  Delayed
                </>
              ) : (
                <button
                  onClick={() => setLeftOffset(0)}
                  className="go-live-button"
                >
                  Go Live
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="chart-header-right">
          <div className="chart-header-col-5">
            <div className="chart-navigation">
              <button
                className={`chart-navigation-button ${
                  leftScroll > 0 ? 'is-active' : ''
                } ${values.length - leftOffset < zoomLevel ? 'disabled' : ''}`}
                onClick={handleMoveLeft}
              >
                <FiChevronsLeft />
              </button>
              <button
                className={`chart-navigation-button ${
                  rightScroll > 0 ? 'is-active' : ''
                } ${leftOffset == 0 ? 'disabled' : ''}`}
                onMouseDown={handleRightStart}
                onMouseUp={handleRightStop}
                onClick={handleMoveRight}
              >
                <FiChevronsRight />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="chart-container"
        ref={target}
        style={{ touchAction: 'none' }}
        // onTouchMove={(e) => handleDrag}
        // onTouchCancel={(e) => console.log("Touch Cancel", e)}
        // onTouchEnd={(e) => setDragging(false)}
        // onTouchStart={(e) => setDragging(true)}
      >
        <ApexChart
          type="area"
          options={options}
          series={dataFrame}
          height={chartHeight}
          width={chartWidth}
          className="quant-chart-item"
        />
      </div>
    </div>
  );
};

export default Chart;
