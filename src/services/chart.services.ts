import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import { URLSearchParams } from 'url';
import { BiometricData } from '../types/WebsocketData';
import Analytics from '../utils/Analytics';
// import { BiometricData } from '../types/WebsocketData';

const getPastChartdata = `${baseURLhttp}/FetchPastGraphData`;

export const fetchPastChartData = async (params: URLSearchParams) => {
  return new Promise<Array<BiometricData>>((resolve, reject) => {
    axios
      .get(getPastChartdata, { params })
      .then((response) => {
        Analytics.track(
          'reqpastgraphdata',
          JSON.stringify({
            pid: params.get('pid'),
            date: params.get('toDate') ? params.get('toDate') : params.get('fromDate'),
            biometricId: params.get('biometricId'),
          })
        );

        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};
