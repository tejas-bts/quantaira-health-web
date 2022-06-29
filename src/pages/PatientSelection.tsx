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
import MultiLingualLabel from '../components/core/MultiLingualLabel';
import Analytics from '../utils/Analytics';

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
            title={<MultiLingualLabel id="SELECT_HOSPITAL" />}
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
            title={<MultiLingualLabel id="SELECT_BUILDING" />}
          />
          <QuantairaDropdown
            options={building ? building.floors.map((item: any) => item.floorName) : []}
            onChange={(selectedOption: any, index: any) => {
              if (building) localStorage.setItem('floor', JSON.stringify(building.floors[index]));
              dispatch(selectFloor(building ? building.floors[index] : undefined));
            }}
            value={floor && floor.floorName}
            title={<MultiLingualLabel id="SELECT_FLOOR" />}
          />
          <QuantairaDropdown
            options={floor ? floor.rooms.map((item: any) => item.roomName) : []}
            onChange={(selectedOption: any, index: any) => {
              if (floor) localStorage.setItem('room', JSON.stringify(floor.rooms[index]));
              dispatch(selectRoom(floor ? floor.rooms[index] : undefined));
            }}
            value={room && room.roomName}
            title={<MultiLingualLabel id="SELECT_ROOM" />}
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
            title={<MultiLingualLabel id="SELECT_BED_NUMBER" />}
          />
          <span>OR</span>
          <QuantairaDropdown
            options={room ? room.beds.map((item: any) => item.patientID) : []}
            onChange={(selectedOption: any, index: any) => {
              Analytics.track('patientselected', room ? room.beds[index] : '');
              if (room) localStorage.setItem('bed', JSON.stringify(room.beds[index]));
              dispatch(selectBed(room ? room.beds[index] : undefined));
            }}
            title={<MultiLingualLabel id="SELECT_PATIENT_ID" />}
            value={bed && bed.patientID}
          />
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
              <MultiLingualLabel id="DONE" />
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
