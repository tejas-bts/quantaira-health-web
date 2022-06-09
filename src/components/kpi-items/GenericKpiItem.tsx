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
  const [warningInterval, setWarningInterval] = useState<NodeJS.Timer | null>(null);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (currentValue != undefined && idealMax != undefined && idealMin != undefined) {
      if (currentValue > idealMax || currentValue < idealMin) {
        const interval = setInterval(() => {
          if (kpiBox.current != null) {
            if (kpiBox.current.style.filter == '') {
              kpiBox.current.style.filter = 'invert(1)';
            } else {
              kpiBox.current.style.filter = '';
            }
          }
        }, 800);
        setWarningInterval(interval);
      } else {
        if (warningInterval != null) clearInterval(warningInterval);
        setWarningInterval(null);
      }
    }

    return () => {
      if (warningInterval != null) clearInterval(warningInterval);
      if (kpiBox.current != null) kpiBox.current.style.filter = '';
    };
  }, [currentValue, idealMax, idealMin]);

  useEffect(() => {
    if (!isLive) {
      if (warningInterval != null) {
        setWarning(false);
        clearInterval(warningInterval);
        setWarningInterval(null);
        console.log('Is LIVE', isLive, warningInterval);
      }
    }
  }, [isLive, warning]);

  return (
    <div
      ref={kpiBox}
      className={`kpi-item ${isLive ? 'live' : 'delayed'}`}
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
