import React from 'react';
import { useSelector } from 'react-redux';
import BreadCrumbs from './BreadCrumbs';
import DateTimePicker from './DateTimePicker';
import PatientIdInput from './PatientIdInput';

const Header = ({ onPatientChange, onDateTimeChange }: any) => {
  const hospital = useSelector((state: any) => state.patient.hospital);
  const building = useSelector((state: any) => state.patient.building);
  const floor = useSelector((state: any) => state.patient.floor);
  const room = useSelector((state: any) => state.patient.room);
  const bed = useSelector((state: any) => state.patient.bed);
  const patient = useSelector((state: any) => state.patient.patient);

  return (
    <div className="header-container">
      <div className="m-2">
        <span className="btn btn-1">
          <input
            type="checkbox"
            name=""
            id="switch"
            onChange={() =>
              document.getElementById('root')?.requestFullscreen()
            }
            checked={true}
          />
          <label htmlFor="switch"></label>
        </span>
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
        <div className="m-2">
          {bed && <PatientIdInput value={bed.patientID} />}
        </div>
      </div>
      <div className="m-3">
        <DateTimePicker size="lg" onChange={onDateTimeChange} disableFuture />
      </div>
    </div>
  );
};

export default Header;
