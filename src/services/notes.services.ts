import axios from 'axios';

const baseURL = 'http://192.168.1.29:7071/api';

const saveNotesAndMedications = `${baseURL}/AddNotes`;
const getNotesAndMedications = `${baseURL}/FetchNotesMedication`;

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
