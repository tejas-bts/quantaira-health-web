import axios from 'axios';

const baseURL = 'http://192.168.1.29:7071/api';


const getKPIdata = `${baseURL}/FetchKPIPastData`;

axios.defaults.headers.common = {
  'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsInVzZXJuYW1lIjoiYWRpdHlhZG9lQGhvc3BpdGFsZG9tYWluLmNvbSIsImlhdCI6MTY0Njc0NDY4OX0.5_6N_XGCfmYMBpqUNIKgrnsYaTiTJVV9cydzlNfUHpg',
};



export const fetchKpi = async () => {
  console.log('Fetching KPI data');
  return new Promise<void>((resolve, reject) => {
    axios.get(getKPIdata, {
      params: {
        'bed_id': '1',
        'pid': '1234',
        'fromDate': '1646793279000',
        'limit': '100'
      }
    })
      .then((response) => {
        console.log('Fetch KPI Response', response);
        resolve(response.data.data.data);
      })
      .catch((e) => {
        console.log('Error Fetch KPI', e);
        reject(e);
      });
  });
};
