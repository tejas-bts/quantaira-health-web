import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const saveNotesAndMedications = `${baseURLhttp}/AddNotes`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;

export const saveNote = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(saveNotesAndMedications, { ...params, ipType: '803F6D90-1F23-42D3-BA18-63954638CF4F', pid: params.patientId, categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D' })
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};


export const fetchNotes = async (parameters: any) => {
  console.log('Fetch Notes called');
  return new Promise<void>((resolve, reject) => {
    axios.get(getNotesAndMedications, { params: { ...parameters, input_type_id: '803F6D90-1F23-42D3-BA18-63954638CF4F', pid: parameters.patientId } })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};
