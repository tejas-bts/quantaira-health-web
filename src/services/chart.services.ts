import axios from 'axios';
import { baseURLhttp } from '../utils/constants';


const getPastChartdata = `${baseURLhttp}/FetchPastGraphDataz`;

axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};



// eslint-disable-next-line no-unused-vars
export const fetchPastChartData = async ({ bedId, patientId, fromDate, limit, biometricId }
  : { bedId: string | number, patientId: string | number, fromDate: number, limit: number, biometricId?: string | number }) => {
  // return new Promise<void>((resolve, reject) => {
  //   axios.get(getPastChartdata, {
  //     params: {
  //       bed_id: bedId, pid: patientId, fromDate, limit, biometricId
  //     }
  //   })
  //     .then((response) => {
  //       resolve(response.data.data.data);
  //     })
  //     .catch((e) => {
  //       console.error('Error Fetch KPI', e);
  //       reject(e);
  //     });
  // }
  // );
  return new Promise((resolve) => {
    console.log(getPastChartdata);
    setTimeout(() => {

      const data = {
        error: false,
        data: {
          pid: '1234',
          bed: 'Bed07',
          label: 'Temp',
          biometricId: 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
          description: 'Temprature',
          unit: 'C',
          idealMin: 35,
          idealMax: 37.5,
          values: [...Array(5)].map((i, index) => [fromDate - ((index + 1) * 1000), Math.random()]),
        },
        message: 'OK'
      };
      resolve(data.data);
    }, 500);
  });
};
