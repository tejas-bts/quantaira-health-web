/* eslint-disable no-extra-boolean-cast */
import axios from 'axios';
import DeviceDetector from 'device-detector-js';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

// Check Cookie if exisits (expired)
// !cookie then create one and save to DB
// Get Session ID and make all calls

// GET IP OF NODE
const getIpV6 = () => {
  return new Promise((resolve, reject) => {
    // Make a request for a user with a given ID

    axios
      .get('https://geolocation-db.com/json/', { headers: [] })
      .then(function (response) {
        resolve(response.data.IPv4);
      })
      .catch(function (error) {
        // // console.log(error);
        reject(error);
      })
      .finally(function () {
        // always executed
      });
  });
};

const getLocation = (ip) => {
  return new Promise((resolve, reject) => {
    // Make a request for a user with a given ID
    axios
      .get(`https://ipapi.co/${ip}/json`)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

let getDeviceInfo = () => {
  return new Promise(function (resolve) {
    let deviceDetector = new DeviceDetector();
    let userAgent = navigator.userAgent;
    let device = deviceDetector.parse(userAgent);
    // // console.log('Device :: ', device);
    let deviceDetails = {
      deviceType: device.device.type,
      browser: device.client.name,
      version: device.client.version,
      os: ''.concat(device.os.name, ' ').concat(device.os.version),
      brand: ''.concat(device.device.brand, ' ').concat(device.device.modal),
    };
    resolve(deviceDetails);
  });
};

const Session = () => {
  return new Promise((resolve, reject) => {
    if (!localStorage.getItem('baseUrl')) {
      reject('Not Initialized');
    } else {
      if (Cookies.get('sessionId') === undefined) {
        manageSession().then(() => {
          let staticVals = JSON.parse(Cookies.get('staticData'));
          let sessionId = Cookies.get('sessionId');

          let token = null;
          if (localStorage.getItem('user')) {
            token = JSON.parse(localStorage.getItem('user')).token;
          }

          let dataToSend = JSON.stringify({
            sessionId,
            token,
            location: staticVals.location,
            sessionIp: staticVals.sessionIp,
            deviceType: staticVals.deviceType,
            browserType: staticVals.browserType,
            browserVersion: staticVals.version,
            os: staticVals.os,
            brand: staticVals.brand,
            starttime: new Date().getTime(),
            domain: window.location.href,
          });

          let config = {
            method: 'post',
            url: 'https://demo-quantio-bts-funcapp-eus.azurewebsites.net/api/SessionCreate?',
            headers: {
              'Content-Type': 'application/json',
            },
            data: dataToSend,
          };

          // // console.log('Config ::::::', config);

          axios(config)
            .then(() => {
              // // console.log(JSON.stringify(response.data));
              resolve('OK');
            })
            .catch((error) => {
              // console.log('Session Call Error :: ', error);
              reject(error);
            });
        });
      } else {
        resolve('OK');
      }
    }
  });
};

let manageSession = () => {
  return new Promise((resolve, reject) => {
    let localSessionId = Cookies.get('sessionId');

    if (localSessionId === '' || localSessionId === undefined) {
      localSessionId = uuidv4().toUpperCase();
      Cookies.set('sessionId', localSessionId, { expires: 0.5 });
    }

    let staticData = undefined;
    if (Cookies.get('staticData')) {
      staticData = JSON.parse(Cookies.get('staticData'));
    }

    if (staticData === '' || staticData === undefined) {
      getIpV6().then((da) => {
        getLocation(da)
          .then((daa) => {
            getDeviceInfo().then((dInfo) => {
              staticData = {
                location: daa.city,
                sessionIp: da,
                deviceType: dInfo.deviceType,
                browserType: dInfo.browser,
                browserVersion: dInfo.version,
                os: dInfo.os,
                brand: dInfo.brand,
              };

              Cookies.set('staticData', JSON.stringify(staticData), {
                expires: 0.5,
              });

              resolve('OK');
            });
          })
          .catch((err) => {
            // console.log('Error V6');
            reject(err);
          });
      });
    } else {
      resolve('OK');
    }
  });
};

let init = (baseURL) => {
  if (!!baseURL) {
    // // console.log('Init called');
    localStorage.setItem('baseUrl', baseURL);
    // // console.log(localStorage.getItem('baseUrl'));
  } else {
    return 'Requires Base Url';
  }
};

// =======================================================
// =======================================================
// =======================================================
// =======================================================

// Main Functions

// =======================================================
// =======================================================
// =======================================================
// =======================================================

// Get User Action and store to DB

let track = (action, action_info) => {
  //  Send sessionId, event_time, actionId, actionInfo to :: user_events

  //   user_action_guid action_name
  // ED65FF37-AA5C-4683-B1DF-2F4116473FE7 Log In
  // B42155C0-9E47-43F3-9BDC-AD275B25649A Log Out
  // 0FA5E1FD-C43A-4CB1-945E-6A892571E02D Requested Patient Data
  // D3F8DFCE-C02C-4B79-B98F-56BC2395FBDF Requested Graph Data
  // EAAE936B-623A-46D3-B91B-FD4C532780DA Requested KPI Data
  // 47E20D08-6C85-419F-95B7-AEAA416F6A80 Requested PAST Graph Data
  // 5235BC80-DAFD-4727-9654-286FC1856CDC Requested PAST KPI Data
  // FC954406-538B-4EFC-9611-50E3608D8510 Requested Notes
  // A9A448A2-E778-4E5E-A915-4638E27FBF1B Requested Medication
  // 3084862C-C11A-4F2F-AA67-D8AC486C8D99 Searched Notes
  // B767CB94-E49D-42DF-8920-E7CBECCFC33D Searched Medication
  // 1DACB546-C42A-4EFA-BC80-15A576E0F36D Added Note / Medication
  // 7889A209-B90B-47BE-AA49-5D983A5999CF	Patient Selected
  // 93C8BC85-7AAA-4809-8077-C87E9177B5CC	Selection view changed
  // 189256FC-B503-4A2B-9D4F-F3173794E035	Biometric added to watchlist
  // AB640511-76AA-4FDB-BF77-51B0C0C169E1	Fetched Patient Details

  Session()
    .then(() => {
      let data = JSON.stringify({
        sessionid: Cookies.get('sessionId'),
        event_time: new Date().getTime(),
        action,
        action_info: action_info,
      });

      let config = {
        method: 'post',
        url: 'https://demo-quantio-bts-funcapp-eus.azurewebsites.net/api/Track?',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      axios(config)
        .then(() => {
          // console.log('Tracked');
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((err) => {
      console.log('Error in Intialization', err);
      return 'Initialize First ';
    });

  // SessionCreate
  // Track
};

let Analytics = {
  init,
  track,
};

export default Analytics;
