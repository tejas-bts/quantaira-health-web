import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';

const login = `${baseURLhttp}/LoginUser`;
const resetPassword = `${baseURLhttp}/ResetPassword`;

export const loginUser = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(login, { ...params })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};


export const resetUserPassword = async (params: { token: string, password: string, cpassword: string }) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(resetPassword, { ...params })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};