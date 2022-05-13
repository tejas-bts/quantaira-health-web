import React, { useEffect, useState } from 'react';
import { GiFlamethrowerSoldier } from 'react-icons/gi';
import Chart from '../../components/core/SimpleChart';

const TestChart = () => {
  const [data, setData] = useState<Array<any>>([]);
  const [history, setHistory] = useState<Array<any>>([]);

  const onDemand = (time: number) => {
    return new Promise<void>((resolve) => {
      console.log('new History', new Date(time));

      setTimeout(() => {
        const newHistory: Array<[number, number]> = [];
        for (let i = 0; i < 10; i++) {
          newHistory.push([
            Math.floor(time / 1000) - (10 - i),
            parseFloat(Math.random().toFixed(1)),
          ]);
          console.log('Target Time', [
            Math.floor(time / 1000) - (10 - i),
            Math.random().toFixed(1),
          ]);
        }
        setHistory((oldHistory) => {
          if (oldHistory.length > 0) {
            if (oldHistory[0][0] > newHistory[newHistory.length - 1][0]) {
              return [...newHistory, ...oldHistory];
            } else {
              return oldHistory;
            }
          } else {
            return newHistory;
          }
        });
        resolve();
      }, 200);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData(() => {
        const dataItem = [];
        const time = Math.floor(new Date().getTime() / 1000);
        dataItem.push(time);
        if (Math.floor(time / 1000) % 3 < 2) dataItem.push(Math.random().toFixed(1));
        return [dataItem];
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-100 w-100">
      <Chart
        title={'Test Chart'}
        color={'red'}
        Icon={GiFlamethrowerSoldier}
        curveType={'smooth'}
        idealMin={'0.23'}
        idealMax={'0.8'}
        unit={'test unit'}
        values={data}
        history={history}
        notes={[]}
        medications={[]}
        onDataDemand={onDemand}
      />
    </div>
  );
};

export default TestChart;
