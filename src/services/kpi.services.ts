import axios from 'axios';
import { baseURLhttp } from '../utils/constants';


const getKPIdata = `${baseURLhttp}/FetchKPIPastData`;

axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};



export const fetchKpi = async ({ bedId, patientId, fromDate, limit }: { bedId: string | number, patientId: string | number, fromDate: string | number, limit: number }) => {
  console.log('Fetching KPI data');
  return new Promise<void>((resolve, reject) => {
    axios.get(getKPIdata, {
      params: {
        bed_id: bedId, pid: patientId, fromDate, limit
      }
    })
      .then((response) => {
        resolve(response.data.data.data);
      })
      .catch((e) => {
        console.log('Error Fetch KPI', e);
        reject(e);
      });
  });
};
