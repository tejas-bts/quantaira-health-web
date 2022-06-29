import axios from './authenticatedAxios';

import { baseURLhttp } from '../utils/constants';
import { Analytics } from '../types/Core.types';

const getAnalyticsData = `${baseURLhttp}/FetchAnalytics`;

// Final URL Should  be :: https://demo-quantio-funcapp-eus.azurewebsites.net/api/FetchAnalytics?sessionid=670ADAC5-CB88-4F54-B4D4-EC97072C3AFE
// BUT
// Current URL is https://demo-quantio-funcapp-eus.azurewebsites.net/api/FetchAnalytics?0=670ADAC5-CB88-4F54-B4D4-EC97072C3AFE
//  Session ID missing

export const fetchAnalyticsData = async (sessionid: string) => {
  return new Promise<Analytics[]>((resolve, reject) => {
    axios
      .get(getAnalyticsData, { params: { sessionid } })
      .then((response) => {
        resolve(
          response.data.data.map((item: any) => {
            const analyticsItem: Analytics = {
              actionName: item.action_name,
              actionInfo: item.action_info,
              sessionId: item.sessionid,
              timeStamp: parseInt(item.event_time),
              deviceType: item.device_type,
              browserType: item.browser_type,
              os: item.os,
              ipAddress: item.sessionip,
            };
            return analyticsItem;
          })
        );
      })
      .catch((e) => reject(e));
  });
};
