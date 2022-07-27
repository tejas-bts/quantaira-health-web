/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { GiFlamethrowerSoldier } from 'react-icons/gi';
import Chart from '../../components/core/SimpleChart';

const TestChart = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [history, setHistory] = useState<Array<any>>([]);

  const onDemand = (time: number, direction: 'to' | 'from') => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const newHistory: Array<[number, number]> = [];
        for (let i = 0; i < 10; i++) {
          newHistory.push([
            Math.floor(time / 1000) - (10 - i),
            parseFloat(Math.random().toFixed(1)),
          ]);
        }
        setHistory((oldHistory) => [...oldHistory, ...newHistory]);
        resolve();
      }, 200);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((history) => {
        const dataItem = [];
        const time = Math.floor(new Date().getTime() / 1000);
        dataItem.push(time);
        dataItem.push(new Date().getSeconds() + parseFloat(Math.random().toFixed(1)));
        return [...history, dataItem];
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-100 w-100">
      <Chart
        chartTime={new Date()}
        isLive={true}
        title={'Test Chart'}
        color={'white'}
        Icon={GiFlamethrowerSoldier}
        curveType={'smooth'}
        idealMax={44}
        idealMin={16}
        unit={'test unit'}
        values={[]}
        history={history}
        notes={[]}
        medications={[]}
        onDataDemand={onDemand}
      />
    </div>
  );
};

export default TestChart;
