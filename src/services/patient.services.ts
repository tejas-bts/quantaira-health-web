import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const getPatientData = `${baseURLhttp}/PatientDetails`;

export const fetchPatientData = async (patientId: string) => {
  console.log('Fetch Patient called');
  return new Promise<void>((resolve, reject) => {
    axios.get(getPatientData, { params: { pid: patientId } })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};