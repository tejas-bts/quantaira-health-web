import axios from 'axios';
import { baseURLhttp } from '../utils/constants';



const login = `${baseURLhttp}/LoginUser`;

export const loginUser = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(login, { ...params })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};