/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { hostname } from 'os';
import React, { useEffect, useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectBed,
  selectBuilding,
  selectFloor,
  selectHospital,
  selectRoom,
} from '../../reducers/patient';
import MultiLingualLabel from './MultiLingualLabel';

const BreadCrumbItem = ({
  title,
  options,
  onSelect,
  value,
}: {
  title: any;
  options: Array<{ id: number | string; label: string }>;
  onSelect?: any;
  value: any;
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(undefined);
  const [showDrop, setShow] = useState(false);

  useEffect(() => {
    if (selectedOption && typeof onSelect == 'function') onSelect(selectedOption);
  }, [selectedOption]);

  // useEffect(() => {
  //   if (options.length === 1) {
  //     setSelectedOption(options[0]);
  //   }
  // }, [options]);

  const hospital = useSelector((state: any) => state.patient.hospital);

  return (
    <div
      className={`quantaira-breadcrumb-item ${
        showDrop ? 'open' : value == undefined ? 'closed' : 'selected-option'
      }`}
      onClick={() => setShow(!showDrop)}
    >
      <span>{value ? value.label : title}</span>

      <BsChevronRight className={`arrow ${selectedOption == undefined && 'down'}`} />
      {showDrop && (
        <div className={`breadcrumb-drop ${!showDrop && 'hidden'}`}>
          {options.map((item, index) => (
            <div
              className="breadcrumb-drop-item"
              key={index}
              onClick={() => setSelectedOption(() => item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BreadCrumbs = ({
  hospital,
  building,
  floor,
  room,
  bed,
  patient,
  onChange,
}: {
  hospital?: any | undefined;
  building?: any;
  floor?: any;
  room?: any;
  patient?: any;
  bed?: any;
  onChange?: any;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="quantaira-breadcrumbs">
      <BreadCrumbItem
        title={<MultiLingualLabel id="SELECT_HOSPITAL" />}
        options={
          hospital
            ? [
                {
                  id: hospital.hospitalId,
                  label: hospital.hospitalName,
                  ...hospital,
                },
              ]
            : []
        }
        onSelect={(hospital: any) => dispatch(selectHospital(hospital))}
        value={hospital ? { label: hospital.hospitalName } : undefined}
      />

      {hospital && (
        <BreadCrumbItem
          title={<MultiLingualLabel id="SELECT_BUILDING" />}
          options={hospital.buildings.map((item: { buildingId: any; buildingName: any }) => {
            return { id: item.buildingId, label: item.buildingName, ...item };
          })}
          onSelect={(building: any) => dispatch(selectBuilding(building))}
          value={building ? { label: building.buildingName } : undefined}
        />
      )}

      {building && (
        <BreadCrumbItem
          title={<MultiLingualLabel id="SELECT_FLOOR" />}
          options={building.floors.map((item: { floorId: any; floorName: any }) => {
            return {
              id: item.floorId,
              label: `Floor no. ${item.floorName}`,
              ...item,
            };
          })}
          onSelect={(floor: any) => dispatch(selectFloor(floor))}
          value={floor ? { label: floor.floorName } : undefined}
        />
      )}

      {floor && (
        <BreadCrumbItem
          title={<MultiLingualLabel id="SELECT_ROOM" />}
          // options={['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5']}
          options={floor.rooms.map((item: { roomNumber: any; roomName: any }) => {
            return {
              id: item.roomNumber,
              label: item.roomName,
              ...item,
            };
          })}
          onSelect={(room: any) => dispatch(selectRoom(room))}
          value={room ? { label: room.roomName } : undefined}
        />
      )}

      {room && (
        <BreadCrumbItem
          title={<MultiLingualLabel id="SELECT_BED" />}
          options={room.beds.map((item: { bedId: any; bedNumber: any }) => {
            return {
              id: item.bedId,
              label: item.bedNumber,
              ...item,
            };
          })}
          value={bed ? { label: bed.bedNumber } : undefined}
          onSelect={(bed: any) => dispatch(selectBed(bed))}
        />
      )}
    </div>
  );
};

export default BreadCrumbs;

// hospital > Building > Floor > Room >Patient ID
