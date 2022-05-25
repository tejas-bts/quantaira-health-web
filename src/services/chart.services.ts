/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import { URLSearchParams } from 'url';

const getPastChartdata = `${baseURLhttp}/FetchPastGraphData`;

export const fetchPastChartData = async (params: URLSearchParams) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(getPastChartdata, {
        params,
      })
      .then((response) => {
        const values = response.data.data.values;
        const value = response.data.data.values[values.length - 1][0];
        console.log(
          'Time Request',
          params.get('biometricId'),
          new Date(parseInt(`${params.get('fromDate')}`)),
          new Date(parseInt(value) * 1000)
        );
        resolve(response.data.data);
      })
      .catch((e) => {
        console.error('Error Fetch KPI', e);
        reject(e);
      });
  });
};
