import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import { Note } from '../types/Core.types';
import Analytics from '../utils/Analytics';

const saveNotesAndMedications = `${baseURLhttp}/AddNotes`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;
const searchAddedNotes = `${baseURLhttp}/SearchNotesMedications`;

export const saveNote = async (parameters: {
  patientId: string;
  deviceId: string;
  content: string;
  inputTimeStamp: number;
}) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(saveNotesAndMedications, {
        device: parameters.deviceId,
        ipType: '803F6D90-1F23-42D3-BA18-63954638CF4F',
        categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D',
        pid: parameters.patientId,
        inputTime: parameters.inputTimeStamp,
        content: parameters.content,
      })
      .then(() => {
        Analytics.track(
          'addnotesmedication',
          JSON.stringify({
            device: parameters.deviceId,
            ipType: '803F6D90-1F23-42D3-BA18-63954638CF4F',
            categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D',
            pid: parameters.patientId,
            inputTime: parameters.inputTimeStamp,
            content: parameters.content,
          })
        );
        resolve();
      })
      .catch((e) => reject(e));
  });
};

export const fetchNotes = async (parameters: { patientId: string; deviceId: string }) => {
  // console.log('Fetch Notes called');
  return new Promise<undefined | Array<Note>>((resolve, reject) => {
    axios
      .get(getNotesAndMedications, {
        params: {
          device: parameters.deviceId,
          input_type_id: '803F6D90-1F23-42D3-BA18-63954638CF4F',
          pid: parameters.patientId,
        },
      })
      .then((response) => {
        Analytics.track('reqnotes', parameters.patientId);
        const notes: undefined | Array<Note> = response.data.data.map((item: any) => {
          return {
            id: item.row_id,
            timeStamp: item.inputTime,
            author: {
              id: item.createdby,
              name: item.userName,
              role: item.categoryName,
            },
            note: item.inputContent,
          };
        });
        resolve(notes);
      })
      .catch((e) => reject(e));
  });
};

export const searchPatientsNotes = async (patientId: string | number, query: string) => {
  return new Promise<undefined | Array<Note>>((resolve, reject) => {
    axios
      .get(searchAddedNotes, { params: { searchType: 'notes', searchTerm: query, pid: patientId } })
      .then((response) => {
        Analytics.track('srhnotes', `Keyword : ${query}`);
        const notes: undefined | Array<Note> = response.data.data.map((item: any) => {
          return {
            product: {
              name: item.productName,
              strength: item.strength,
            },
            id: item.row_id,
            timeStamp: item.inputTime,
            author: {
              id: item.createdby,
              name: item.userName,
              role: item.categoryName,
            },
            note: item.inputContent,
          };
        });
        resolve(notes);
      })
      .catch((e) => reject(e));
  });
};
