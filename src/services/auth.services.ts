import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import Analytics from '../utils/Analytics';

const login = `${baseURLhttp}/LoginUser`;
const resetPassword = `${baseURLhttp}/ResetPassword`;

export const loginUser = async (parameters: { userName: string; password: string }) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(login, { username: parameters.userName, password: parameters.password })
      .then((data: any) => {
        Analytics.track('login', parameters.userName);
        resolve(data.data.data);
      })
      .catch((e) => reject(e));
  });
};

export const resetUserPassword = async (parameters: {
  token: string;
  password: string;
  cpassword: string;
}) => {
  return new Promise<void>((resolve, reject) => {
    axios.defaults.headers.common = {
      Authorization: parameters.token,
    };
    axios
      .post(resetPassword, {
        token: parameters.token,
        password: parameters.password,
        cpassword: parameters.cpassword,
      })
      .then((data: any) => {
        Analytics.track('login', `Reset password ${parameters.token}`);
        resolve(data.data.data);
      })
      .catch((e) => reject(e));
  });
};
