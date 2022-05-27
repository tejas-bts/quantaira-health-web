import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const getKPIdata = `${baseURLhttp}/FetchKPIPastData`;

export const fetchKpi = async ({
  bedId,
  patientId,
  fromDate,
  limit,
}: {
  bedId: string | number;
  patientId: string | number;
  fromDate: string | number;
  limit: number;
}) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .get(getKPIdata, {
        params: {
          bedId,
          pid: patientId,
          fromDate,
          limit,
        },
      })
      .then((response) => {
        resolve(response.data.data.data);
      })
      .catch((e) => {
        console.error('Error Fetch KPI', e);
        reject(e);
      });
  });
};
