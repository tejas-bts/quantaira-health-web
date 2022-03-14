/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { STsegmentProps } from '../../types/KpiItem.proptype';

const STsegment = (props: STsegmentProps) => {
  const {
    color,
    unit,
    st1Value,
    st2Value,
    st3Value,
    stAVRValue,
    stAVLValue,
    stAVFValue,
    stVvalue,
    isLive,
  } = props;
  return (
    <div
      className="kpi-item st-segment"
      style={{
        color: isLive ? color : 'grey',
        borderColor: isLive ? color : 'grey',
      }}
    >
      <div className="kpi-grid">
        <div>
          <div className="kpi-title">ST</div>
          <div className="kpi-unit">{unit || '?'}</div>
        </div>
        <div className="kpi-st-values">
          <div className="kpi-st-col">
            <div className="kpi-st-row">
              <div>I</div>
              <div>{st1Value ?? '?'}</div>
            </div>
            <div className="kpi-st-row">
              <div>II</div>
              <div>{st2Value ?? '?'}</div>
            </div>
            <div className="kpi-st-row">
              <div>III</div>
              <div>{st3Value ?? '?'}</div>
            </div>
          </div>
          <div className="kpi-st-col">
            <div className="kpi-st-row">
              <div>aVR</div>
              <div>{stAVRValue ?? '?'}</div>
            </div>
            <div className="kpi-st-row">
              <div>aVL</div>
              <div>{stAVLValue ?? '?'}</div>
            </div>
            <div className="kpi-st-row">
              <div>aVF</div>
              <div>{stAVFValue ?? '?'}</div>
            </div>
          </div>
          <div className="kpi-st-col">
            <div className="kpi-st-row">
              <div>V</div>
              <div>{stVvalue ?? '?'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default STsegment;
