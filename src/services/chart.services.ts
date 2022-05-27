import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import { URLSearchParams } from 'url';
import { BiometricData } from '../types/WebsocketData';
// import { BiometricData } from '../types/WebsocketData';

const getPastChartdata = `${baseURLhttp}/FetchPastGraphData`;

export const fetchPastChartData = async (params: URLSearchParams) => {
  return new Promise<Array<BiometricData>>((resolve, reject) => {
    axios
      .get(getPastChartdata, { params })
      .then((response) => {
        if (params.get('fromDate') != null) {
          resolve([response.data.data]);
        } else {
          resolve(response.data.data);
        }
      })
      .catch((e) => reject(e));
  });
};
