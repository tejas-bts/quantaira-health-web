export interface Bed {
  bedId: string;
  bedNumber: string | number;
  patientID: number | string;
}

export interface Room {
  roomName: string;
  roomNumber: number | string;
  beds?: Array<Bed>;
}

export interface Floor {
  floorId: number | string;
  floorName: string;
  rooms?: Array<Room>;
}

export interface Building {
  buildingId: string;
  buildingName: string;
  floors?: Array<Floor>;
}

export interface Hospital {
  hospitalId: string | number;
  hospitalName: string;
  buildings: Array<Building>;
}

export interface Patient {
  hospital: Hospital;
  building: Building;
  floor: Floor;
  room: Room;
  bed: Bed;
}

export interface Note {
  id: string | number;
  timeStamp: number;
  author: { id: string; name: string; role: 'Doctor' | 'Nurse' | 'Clinician' };
  deviceId?: string;
  note: string;
}

export interface Medication extends Note {
  product: {
    name: string;
    strength: string;
  };
}

export interface Permission {
  permissionId: string;
  permissionName: string;
}
