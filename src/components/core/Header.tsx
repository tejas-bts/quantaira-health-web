import React from 'react';
import BreadCrumbs from './BreadCrumbs';
import DateTimePicker from './DateTimePicker';

const Header = ({ onPatientChange, onDateTimeChange }: any) => {
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
      <div className="flex-1">
        <BreadCrumbs
          hospitalName="Hospital NAme"
          buildingName={'Building NAme'}
          floorNumber={'Floor Number'}
          roomNumber={'Room Number'}
          patientId={'Patient Id'}
          onChange={onPatientChange}
        />
      </div>
      <div className="m-3">
        <DateTimePicker size="lg" onChange={onDateTimeChange} />
      </div>
    </div>
  );
};

export default Header;
