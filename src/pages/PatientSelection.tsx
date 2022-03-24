import React from 'react';
import QuantairaDropdown from '../components/core/QuantairaDropdown';

import { useDispatch, useSelector } from 'react-redux';
import {
  selectBed,
  selectBuilding,
  selectFloor,
  selectHospital,
  selectRoom,
} from '../reducers/patient';
import { useNavigate } from 'react-router-dom';

const PatientSelection = () => {
  const hospital = useSelector((state: any) => state.patient.hospital);
  const building = useSelector((state: any) => state.patient.building);
  const floor = useSelector((state: any) => state.patient.floor);
  const room = useSelector((state: any) => state.patient.room);
  const bed = useSelector((state: any) => state.patient.bed);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="chart-grid">
      <div />
      <div className="patient-selection">
        <div className="patient-selection-row">
          <QuantairaDropdown
            options={hospital ? [hospital.hospitalName] : []}
            onChange={() => {
              localStorage.setItem('hospital', JSON.stringify(hospital));
              dispatch(selectHospital(hospital));
            }}
            value={hospital && hospital.hospitalName}
            title={'Select Hospital'}
          />
        </div>
        <div className="patient-selection-row">
          <QuantairaDropdown
            options={hospital ? hospital.buildings.map((item: any) => item.buildingName) : []}
            onChange={(selectedOption: any, index: any) => {
              if (hospital)
                localStorage.setItem('building', JSON.stringify(hospital.buildings[index]));
              dispatch(selectBuilding(hospital ? hospital.buildings[index] : undefined));
            }}
            value={building && building.buildingName}
            title={'Select Building'}
          />
          <QuantairaDropdown
            options={building ? building.floors.map((item: any) => item.floorName) : []}
            onChange={(selectedOption: any, index: any) => {
              if (building) localStorage.setItem('floor', JSON.stringify(building.floors[index]));
              dispatch(selectFloor(building ? building.floors[index] : undefined));
            }}
            value={floor && floor.floorName}
            title={'Select Floor'}
          />
          <QuantairaDropdown
            options={floor ? floor.rooms.map((item: any) => item.roomName) : []}
            onChange={(selectedOption: any, index: any) => {
              if (floor) localStorage.setItem('room', JSON.stringify(floor.rooms[index]));
              dispatch(selectRoom(floor ? floor.rooms[index] : undefined));
            }}
            value={room && room.roomName}
            title={'Select Room'}
          />
        </div>
        <div className="patient-selection-row">
          <QuantairaDropdown
            options={room ? room.beds.map((item: any) => item.bedNumber) : []}
            onChange={(selectedOption: any, index: any) => {
              if (room) localStorage.setItem('bed', JSON.stringify(room.beds[index]));
              dispatch(selectBed(room ? room.beds[index] : undefined));
            }}
            value={bed && bed.bedNumber}
            title={'Select Bed No.'}
          />
          <span>OR</span>
          <QuantairaDropdown
            options={room ? room.beds.map((item: any) => item.patientID) : []}
            onChange={(selectedOption: any, index: any) => {
              if (room) localStorage.setItem('bed', JSON.stringify(room.beds[index]));
              dispatch(selectBed(room ? room.beds[index] : undefined));
            }}
            title={'Select Patient Id'}
            value={bed && bed.patientID}
          />
          {/* <span>OR</span>
          <QuantairaDropdown
            options={[]}
            onChange={() => console.log()}
            title={'Select Patient Name'}
          /> */}
        </div>
        <div className="d-flex justify-content-end flex-1 w-100 align-items-end">
          <div>
            <button
              className={`quantaira-button lg rounded ${
                bed !== undefined ? 'primary' : 'disabled'
              }`}
              onClick={() => {
                if (bed !== undefined) navigate('/app/kpi', { replace: true });
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
      <div />
      <div />
    </div>
  );
};

export default PatientSelection;
