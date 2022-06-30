import React, { useEffect, useRef, useState } from 'react';
import { KPIitemProp } from '../../types/KpiItem.proptype';

const GenericKpiItem = ({
  title,
  color,
  currentValue,
  idealMin,
  idealMax,
  unit,
  isLive,
}: KPIitemProp) => {
  const kpiBox = useRef<HTMLDivElement>(null);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (currentValue != undefined && idealMax != undefined && idealMin != undefined) {
      if (currentValue > idealMax || currentValue < idealMin) {
        setWarning(true);
      } else {
        setWarning(false);
      }
    }
  }, [currentValue, idealMax, idealMin]);

  return (
    <div
      ref={kpiBox}
      className={`kpi-item ${isLive ? 'live' : 'delayed'} ${warning ? 'warning' : ''}`}
      style={{
        color: isLive && currentValue !== undefined ? color : 'grey',
        borderColor: isLive && currentValue !== undefined ? color : 'grey',
      }}
    >
      <div className="kpi-grid">
        <div className="kpi-meta">
          <div className="kpi-title">{title || '?'}</div>
          <div className="kpi-unit">{unit || '?'}</div>
        </div>
        <div className="kpi-value">{currentValue !== undefined ? currentValue : '?'}</div>
        <div className="kpi-ideal-values">
          <div className="kpi-ideal-max">{idealMax !== undefined ? idealMax : '?'}</div>
          <div className="kpi-ideal-min">{idealMin !== undefined ? idealMin : '?'}</div>
        </div>
      </div>
    </div>
  );
};

export default GenericKpiItem;
