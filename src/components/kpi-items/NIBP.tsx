import React from 'react';
import { NiBpProps } from '../../types/KpiItem.proptype';

const NIBP = ({
  color,
  systolicValue,
  diastolicValue,
  idealSystolicValue,
  idealDiastolicValue,
  unit,
  isLive,
}: NiBpProps) => {
  if (color === undefined) color = 'white';
  return (
    <div
      className={`nibp-kpi-item kpi-item ${isLive ? 'live' : 'delayed'}`}
      style={{
        color:
          isLive && systolicValue !== undefined && diastolicValue !== undefined
            ? color
            : 'grey',
        borderColor:
          isLive && systolicValue !== undefined && diastolicValue !== undefined
            ? color
            : 'grey',
      }}
    >
      <div className="kpi-grid">
        <div className="kpi-meta">
          <div className="kpi-title">NiBP</div>
          <div className="kpi-unit">{unit || '?'}</div>
        </div>
        <div className="kpi-value">
          {systolicValue !== undefined ? systolicValue : '?'}/
          {diastolicValue !== undefined ? diastolicValue : '?'}
        </div>
        <div className="kpi-ideal-values">
          <div className="kpi-ideal-max">
            {idealSystolicValue !== undefined ? idealSystolicValue : '?'}/
            {idealDiastolicValue !== undefined ? idealDiastolicValue : '?'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NIBP;
