import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const login = `${baseURLhttp}/LoginUser`;
const resetPassword = `${baseURLhttp}/ResetPassword`;

export const loginUser = async (parameters: { userName: string; password: string }) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(login, { username: parameters.userName, password: parameters.password })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};

export const resetUserPassword = async (parameters: {
  token: string;
  password: string;
  cpassword: string;
}) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(resetPassword, {
        token: parameters.token,
        password: parameters.password,
        cpassword: parameters.cpassword,
      })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};
