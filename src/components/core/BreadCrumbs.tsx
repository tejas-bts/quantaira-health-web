/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { data } from './testData';

const BreadCrumbItem = ({
  title,
  options,
  onSelect,
  value,
}: {
  title: string;
  options: Array<{ id: number | string; label: string }>;
  onSelect: any;
  value: any;
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(undefined);
  const [showDrop, setShow] = useState(false);

  useEffect(() => {
    console.log('Selected Option', selectedOption);
    if (selectedOption) onSelect(selectedOption);
  }, [selectedOption]);

  return (
    <div
      className={`quantaira-breadcrumb-item ${
        showDrop ? 'open' : value == undefined ? 'closed' : 'selected-option'
      }`}
      onClick={() => setShow(!showDrop)}
    >
      <span>{value ? value.label : title}</span>

      <BsChevronRight
        className={`arrow ${selectedOption == undefined && 'down'}`}
      />
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
  hospitalName,
  buildingName,
  floorNumber,
  roomNumber,
  patientId,
  onChange,
}: {
  hospitalName: string;
  buildingName: string;
  floorNumber: string;
  roomNumber: string;
  patientId: string;
  onChange: any;
}) => {
  const [hospital, setHospital] = useState<any>(undefined);
  const [building, setBuilding] = useState<any>(undefined);
  const [floor, setFloor] = useState<any>(undefined);
  const [room, setRoom] = useState<any>(undefined);
  const [bedId, setBedId] = useState<any>(undefined);
  const [patient, setPatient] = useState<any>(undefined);

  useEffect(() => {
    setFloor(undefined);
    setRoom(undefined);
    setPatient(undefined);
    setBedId(undefined);
  }, [building]);

  useEffect(() => {
    setRoom(undefined);
    setPatient(undefined);
    setBedId(undefined);
  }, [floor]);

  useEffect(() => {
    setPatient(undefined);
    setBedId(undefined);
  }, [room]);

  return (
    <div className="quantaira-breadcrumbs">
      <BreadCrumbItem
        title="Select Hospital"
        options={[{ id: 1, label: 'Hospital 1' }]}
        onSelect={setHospital}
        value={hospital}
      />

      {hospital && (
        <BreadCrumbItem
          title="Select Building"
          options={data.buildings.map((item) => {
            return { id: item.buildingId, label: item.buildingName, ...item };
          })}
          onSelect={setBuilding}
          value={building}
        />
      )}

      {building && (
        <BreadCrumbItem
          title="Select Floor"
          options={building.floors.map(
            (item: { floorId: any; floorName: any }) => {
              return {
                id: item.floorId,
                label: `Floor no. ${item.floorName}`,
                ...item,
              };
            }
          )}
          onSelect={setFloor}
          value={floor}
        />
      )}

      {floor && (
        <BreadCrumbItem
          title="Select Room"
          // options={['Room 1', 'Room 2', 'Room 3', 'Room 4', 'Room 5']}
          options={floor.rooms.map(
            (item: { roomNumber: any; roomName: any }) => {
              return {
                id: item.roomNumber,
                label: item.roomName,
                ...item,
              };
            }
          )}
          onSelect={setRoom}
          value={room}
        />
      )}

      {/* {room && (
        <BreadCrumbItem
          title="Select Patient"
          options={[
            'Patient 1',
            'Patient 2',
            'Patient 3',
            'Patient 4',
            'Patient 5',
          ]}
          onSelect={setPatient}
        />
      )} */}
    </div>
  );
};

export default BreadCrumbs;

// hospital > Building > Floor > Room >Patient ID
