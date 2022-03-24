import { createSlice, current } from '@reduxjs/toolkit';

export const patientState = createSlice({
  name: 'patient',
  initialState: {
    hospitalId: undefined,
    hospitalName: undefined,
    buildingId: undefined,
    buildingName: undefined,
    floorId: undefined,
    floorName: undefined,
    roomNumber: undefined,
    roomName: undefined,
    bedId: undefined,
    bedNumber: undefined,
    patientId: undefined,
    patientName: undefined,


    hospital: undefined,
    building: undefined,
    floor: undefined,
    room: undefined,
    bed: undefined,
    patient: undefined,
  },
  reducers: {
    selectHospital: (state, action) => {
      const currentHospital: any = current(state).hospital;
      if (currentHospital && action.payload) {
        if (currentHospital.hospitalId === action.payload.hospitalId) {
          return state;
        }
      }
      return {
        ...state,
        hospital: action.payload,
        building: undefined,
        floor: undefined,
        room: undefined,
        bed: undefined,
      };
    },
    selectBuilding: (state, action) => {
      const currentBuilding: any = current(state).building;
      if (currentBuilding && action.payload) {
        if (currentBuilding.buildingId === action.payload.buildingId) {
          return state;
        }
      }
      return {
        ...state,
        building: action.payload,
        floor: undefined,
        room: undefined,
        bed: undefined,
      };
    },
    selectFloor: (state, action) => {
      const currentFloor: any = current(state).floor;
      if (currentFloor && action.payload) {
        if (currentFloor.floorId === action.payload.floorId) {
          return state;
        }
      }
      return {
        ...state,
        floor: action.payload,
        room: undefined,
        bed: undefined,
      };
    },

    selectRoom: (state, action) => {
      const currentRoom: any = current(state).room;
      if (currentRoom && action.payload) {
        if (currentRoom.roomNumber === action.payload.roomNumber) {
          return state;
        }
      }
      return {
        ...state,
        room: action.payload,
        bed: undefined,
      };
    },

    selectBed: (state, action) => {
      const currentBed: any = current(state).bed;
      if (currentBed && action.payload) {
        if (currentBed.bedmId === action.payload.bedId) {
          return state;
        }
      }
      return {
        ...state,
        bed: action.payload,
      };
    },
  }
});


export default patientState.reducer;
export const { selectHospital, selectBuilding, selectFloor, selectRoom, selectBed } = patientState.actions;