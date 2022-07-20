import axios from './authenticatedAxios';

import { baseURLhttp } from '../utils/constants';

const getHospitalData = `${baseURLhttp}/FetchUserPatients`;

export const fetchHospitalData = async () => {
  // console.log(hospitalId);
  return new Promise<void>((resolve, reject) => {
    axios
      .get(getHospitalData)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};
