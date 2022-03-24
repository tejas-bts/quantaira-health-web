import axios from 'axios';
import { baseURLhttp } from '../utils/constants';

const saveNotesAndMedications = `${baseURLhttp}/AddNotes`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;

axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};

export const saveNote = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(saveNotesAndMedications, { ...params, ipType: 2, })
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};


export const fetchNotes = async (parameters: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.get(getNotesAndMedications, { params: { ...parameters, input_type_id: 2 } })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};
