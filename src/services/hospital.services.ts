import axios from 'axios';

import { baseURLhttp } from '../utils/constants';


const getHospitalData = `${baseURLhttp}/FetchUserPatients`;

axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};

export const fetchHospitalData = async (hospitalId: number) => {
  console.log(hospitalId);
  return new Promise<void>((resolve, reject) => {
    axios.get(getHospitalData)
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};