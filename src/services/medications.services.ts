import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const saveMedications = `${baseURLhttp}/AddMedication`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;
const searchAvailableMedicines = `${baseURLhttp}/SearchMedicines`;





export const saveMedication = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(saveMedications, { ...params, pid: params.patientId, categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D' })
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};


export const fetchMedications = async (parameters: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.get(getNotesAndMedications, { params: { ...parameters, input_type_id: 'B5CDC538-BFBF-4E84-A76D-DEDD8D419A35', pid: parameters.patientId } })
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
