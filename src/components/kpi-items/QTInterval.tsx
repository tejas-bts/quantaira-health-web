import React from 'react';
import { QTIntervalProps } from '../../types/KpiItem.proptype';

const QTInterval = (props: QTIntervalProps) => {
  const {
    color,
    qtcValue,
    idealQtc,
    qtcUnit,
    deltaQtcValue,
    idealDeltaQtc,
    deltaQtcUnit,
    qtValue,
    idealQt,
    qtUnit,
    isLive,
  } = props;

  return (
    <div
      className="kpi-item qt-kpi-item"
      style={{
        color: isLive ? color : 'grey',
        borderColor: isLive ? color : 'grey',
      }}
    >
      <div className="kpi-grid">
        <div className="kpi-meta">
          <div className="kpi-title">QTc</div>
          <div className="kpi-unit">{qtcUnit}</div>
        </div>
        <div className="kpi-value">{qtcValue ?? '?'}</div>
        <div className="kpi-ideal-values">
          <div className="kpi-ideal-min">{idealQtc ?? '?'}</div>
        </div>
      </div>
      <div className="flex-2 ml-3">
        <div className="kpi-grid mb-3">
          <div className="kpi-meta">
            <div className="kpi-title">&#916;QTc</div>
            <div className="kpi-unit">{deltaQtcUnit}</div>
          </div>
          <div className="kpi-value">{deltaQtcValue ?? '?'}</div>
          <div className="kpi-ideal-values">
            <div className="kpi-ideal-min">{idealDeltaQtc ?? '?'}</div>
          </div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-meta">
            <div className="kpi-title">QT</div>
            <div className="kpi-unit">{qtUnit}</div>
          </div>
          <div className="kpi-value">{qtValue ?? '?'}</div>
          <div className="kpi-ideal-values">
            <div className="kpi-ideal-min">{idealQt ?? '?'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QTInterval;
