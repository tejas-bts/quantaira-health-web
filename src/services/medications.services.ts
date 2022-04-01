import axios from 'axios';
import { baseURLhttp } from '../utils/constants';

const saveMedications = `${baseURLhttp}/AddMedication`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;
const searchAvailableMedicines = `${baseURLhttp}/SearchMedicines`;



axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};


export const saveMedication = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(saveMedications, { ...params, ipType: 1, pid: params.patientId })
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};


export const fetchMedications = async (parameters: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.get(getNotesAndMedications, { params: { ...parameters, input_type_id: 1, pid: parameters.patientId } })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};

export const searchMedications = async (ndc_value: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.get(searchAvailableMedicines, { params: { ndc_value } })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};
