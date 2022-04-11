import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLive, setTime } from '../../reducers/time';
import BreadCrumbs from './BreadCrumbs';
import DateTimePicker from './DateTimePicker';
import PatientIdInput from './PatientIdInput';
import QuantairaSwitch from './QuantairaSwitch';
import MultiLingualLabel from './MultiLingualLabel';

const Header = ({ onPatientChange, onDateTimeChange }: any) => {
  const hospital = useSelector((state: any) => state.patient.hospital);
  const building = useSelector((state: any) => state.patient.building);
  const floor = useSelector((state: any) => state.patient.floor);
  const room = useSelector((state: any) => state.patient.room);
  const bed = useSelector((state: any) => state.patient.bed);
  const patient = useSelector((state: any) => state.patient.bed);

  const dispatch = useDispatch();

  const isLive = useSelector((state: any) => state.time.isLive);
  const time = useSelector((state: any) => state.time.currentTime);

  const handleGoLive = () => {
    dispatch(setLive(true));
    dispatch(setTime({ time: new Date().getTime() }));
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
      <div className="m-2">
        <QuantairaSwitch
          disabled
          onChange={() => console.log('Changed')}
          label1={<MultiLingualLabel id="CLOUD_DATA" />}
          label2={<MultiLingualLabel id="REAL_TIME" />}
        />
      </div>
      <div className="d-flex flex-1">
        <BreadCrumbs
          hospital={hospital}
          building={building}
          floor={floor}
          room={room}
          bed={bed}
          patient={patient}
          onChange={onPatientChange}
        />
        <div className="m-2">{bed && <PatientIdInput value={bed.patientID} />}</div>
      </div>
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
