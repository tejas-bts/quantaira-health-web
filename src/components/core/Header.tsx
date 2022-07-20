import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLive, setTime } from '../../reducers/time';
import BreadCrumbs from './BreadCrumbs';
import DateTimePicker from './DateTimePicker';
import PatientIdInput from './PatientIdInput';
// import QuantairaSwitch from './QuantairaSwitch';
import MultiLingualLabel from './MultiLingualLabel';
import { Patient } from '../../types/Core.types';
import { clearHistoricData } from '../../reducers/history';

const Header = ({ onDateTimeChange }: any) => {
  const hospital = useSelector((state: { patient: Patient }) => state.patient.hospital);
  const building = useSelector((state: { patient: Patient }) => state.patient.building);
  const floor = useSelector((state: { patient: Patient }) => state.patient.floor);
  const room = useSelector((state: { patient: Patient }) => state.patient.room);
  const bed = useSelector((state: { patient: Patient }) => state.patient.bed);
  const patient = useSelector((state: { patient: Patient }) => state.patient.bed);

  const dispatch = useDispatch();

  const isLive = useSelector((state: any) => state.time.isLive);
  const time = useSelector((state: any) => state.time.currentTime);
  const selectedScreen = useSelector((state: any) => state.chart.selectedScreen);
  const chartSelections = useSelector((state: any) => state.chart.selectedCharts);

  const handleGoLive = () => {
    dispatch(setLive(true));
    dispatch(setTime({ time: new Date().getTime() }));
    dispatch(clearHistoricData());
  };

  useEffect(() => {
    if (isLive) {
      const timeOut = setTimeout(() => {
        dispatch(setTime({ time: new Date().getTime() }));
      }, 1000);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [isLive, time]);

  const onDateTimeChanged = (e: any) => {
    dispatch(setLive(false));
    dispatch(setTime({ time: new Date(e).getTime() }));
    onDateTimeChange();
  };

  return (
    <div className="header-container">
      {/* <div className="m-2">
        <QuantairaSwitch
          disabled
          onChange={() => // console.log('Changed')}
          label1={<MultiLingualLabel id="CLOUD_DATA" />}
          label2={<MultiLingualLabel id="REAL_TIME" />}
        />
      </div> */}
      <div className="d-flex flex-1 m-2">
        <BreadCrumbs
          hospital={hospital}
          building={building}
          floor={floor}
          room={room}
          bed={bed}
          patient={patient}
        />
        <div className="m-2">{bed && <PatientIdInput value={bed.patientID} />}</div>
      </div>

      {chartSelections[0].length > 0 ? (
        <div className="current-screen-number d-flex flex-row justify-content-center m-2 mh-80 gap-3">
          <p className="m-0 text-white  mh-80">
            <MultiLingualLabel id="SCREEN_NUMBER" />
          </p>
          <h5 className="m-0 align-self-center white-text  mh-80" style={{ color: 'white' }}>
            <strong>{selectedScreen + 1}</strong>
          </h5>
        </div>
      ) : null}

      {!isLive && (
        <div>
          <button className="go-live-button" onClick={handleGoLive}>
            Go Live
          </button>
        </div>
      )}
      <div className="m-3">
        <DateTimePicker
          size="lg"
          onChange={onDateTimeChanged}
          defaultDate={new Date(time)}
          disableFuture
        />
      </div>
    </div>
  );
};

export default Header;
