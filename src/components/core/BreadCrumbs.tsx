/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { hostname } from 'os';
import React, { ReactNode, useEffect, useState } from 'react';
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
import { Bed, Building, Floor, Hospital, Room } from '../../types/Core.types';
import MultiLingualLabel from './MultiLingualLabel';

const BreadCrumbItem = ({
  id,
  title,
  options,
  onSelect,
  value,
}: {
  id?: string | number;
  title: React.ReactElement;
  options: Array<{ id: number | string; label: string | number }>;
  onSelect?:
    | ((hospital: Hospital) => { payload: Hospital; type: string })
    | ((building: Building) => { payload: Building; type: string })
    | ((floor: Floor) => { payload: Floor; type: string })
    | ((room: Room) => { payload: Room; type: string })
    | ((bed: Bed) => { payload: Bed; type: string });
  value: { label: string | number } | undefined;
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(undefined);
  const [showDrop, setShow] = useState(false);

  useEffect(() => {
    if (selectedOption && typeof onSelect == 'function') onSelect(selectedOption);
  }, [selectedOption]);

  const hospital = useSelector((state: any) => state.patient.hospital);

  return (
    <div
      id={`breadcrumb-item${id !== undefined ? `-${id}` : ''}`}
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
  hospital: Hospital | undefined;
  building: Building | undefined;
  floor: Floor | undefined;
  room: Room | undefined;
  patient: Bed | undefined;
  bed: Bed | undefined;
  onChange?: unknown;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <div className="quantaira-breadcrumbs">
      <BreadCrumbItem
        id={1}
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
        onSelect={(hospital: Hospital) => dispatch(selectHospital(hospital))}
        value={hospital ? { label: hospital.hospitalName } : undefined}
      />

      {hospital && hospital.buildings && (
        <BreadCrumbItem
          id={2}
          title={<MultiLingualLabel id="SELECT_BUILDING" />}
          options={hospital.buildings.map((item: Building) => {
            return { id: item.buildingId, label: item.buildingName, ...item };
          })}
          onSelect={(building: Building) => dispatch(selectBuilding(building))}
          value={building ? { label: building.buildingName } : undefined}
        />
      )}

      {building && (
        <BreadCrumbItem
          id={3}
          title={<MultiLingualLabel id="SELECT_FLOOR" />}
          options={
            building !== undefined && building.floors !== undefined
              ? building.floors.map((item: Floor) => {
                  return {
                    id: item.floorId,
                    label: `Floor no. ${item.floorName}`,
                    ...item,
                  };
                })
              : []
          }
          onSelect={(floor: Floor) => dispatch(selectFloor(floor))}
          value={floor ? { label: floor.floorName } : undefined}
        />
      )}

      {floor && (
        <BreadCrumbItem
          id={4}
          title={<MultiLingualLabel id="SELECT_ROOM" />}
          options={
            floor !== undefined && floor.rooms !== undefined
              ? floor.rooms.map((item: Room) => {
                  return {
                    id: item.roomNumber,
                    label: item.roomName,
                    ...item,
                  };
                })
              : []
          }
          onSelect={(room: Room) => dispatch(selectRoom(room))}
          value={room ? { label: room.roomName } : undefined}
        />
      )}

      {room && (
        <BreadCrumbItem
          id={5}
          title={<MultiLingualLabel id="SELECT_BED" />}
          options={
            room != undefined && room.beds !== undefined
              ? room.beds.map((item: Bed) => {
                  return {
                    id: item.bedId,
                    label: item.bedNumber,
                    ...item,
                  };
                })
              : []
          }
          value={bed ? { label: bed.bedNumber } : undefined}
          onSelect={(bed: Bed) => dispatch(selectBed(bed))}
        />
      )}
    </div>
  );
};

export default BreadCrumbs;
