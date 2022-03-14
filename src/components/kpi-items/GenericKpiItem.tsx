import React from 'react';
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
  return (
    <div
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
        <div className="kpi-value">
          {currentValue !== undefined ? currentValue : '?'}
        </div>
        <div className="kpi-ideal-values">
          <div className="kpi-ideal-max">
            {idealMax !== undefined ? idealMax : '?'}
          </div>
          <div className="kpi-ideal-min">
            {idealMin !== undefined ? idealMin : '?'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericKpiItem;
