/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const getPastChartdata = `${baseURLhttp}/FetchPastGraphData`;

export const fetchPastChartData = async ({
  bedId,
  patientId,
  fromDate,
  limit,
  biometricId,
}: {
  bedId: string | number;
  patientId: string | number;
  fromDate: number;
  limit: number;
  biometricId?: string | number;
}) => {
  return new Promise<any>((resolve, reject) => {
    axios
      .get(getPastChartdata, {
        params: {
          bed_id: bedId,
          pid: patientId,
          fromDate,
          limit,
          biometricId,
        },
      })
      .then((response) => {
        console.log('Past Chart Response', response.data.data);
        resolve(response.data.data);
      })
      .catch((e) => {
        console.error('Error Fetch KPI', e);
        reject(e);
      });
  });
};
