/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';


const getPastChartdata = `${baseURLhttp}/FetchPastGraphData`;




// eslint-disable-next-line no-unused-vars
export const fetchPastChartData = async ({ bedId, patientId, fromDate, limit, biometricId }
  : { bedId: string | number, patientId: string | number, fromDate: number, limit: number, biometricId?: string | number }) => {
  return new Promise<void>((resolve, reject) => {
    axios.get(getPastChartdata, {
      params: {
        bed_id: bedId, pid: patientId, fromDate, limit, biometricId
      }
    })
      .then((response) => {
        console.log('Past Chart Response', response.data.data);
        resolve(response.data.data);
      })
      .catch((e) => {
        console.error('Error Fetch KPI', e);
        reject(e);
      });
  }
  );
  // return new Promise((resolve) => {
  //   console.log(getPastChartdata);
  //   setTimeout(() => {
  //     const data = {
  //       error: false,
  //       data: {
  //         pid: '1234',
  //         bed: 'Bed07',
  //         label: 'Temp',
  //         biometricId: 'B39CFD8E-0F78-4AB4-B2F6-C2CBE40A4445',
  //         description: 'Temperature',
  //         unit: 'C',
  //         idealMin: 35,
  //         idealMax: 37.5,
  //         values: [...Array(5)].map((i, index) => [fromDate - ((5 - index) * 1000), parseInt((Math.random() * 10 + 20).toFixed(0))]),
  //       },
  //       message: 'OK'
  //     };
  //     resolve(data.data);
  //   }, 500);
};
