import React, { useEffect, useState } from 'react';
import { GiFlamethrowerSoldier } from 'react-icons/gi';
import Chart from '../../components/core/SimpleChart';

const TestChart = () => {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(() => {
        const dataItem = [];
        const time = new Date().getTime();
        dataItem.push(time);
        if (Math.floor(time / 1000) % 3 < 2) dataItem.push(Math.random());
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
        notes={[]}
        medications={[]}
      />
    </div>
  );
};

export default TestChart;
