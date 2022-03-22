import axios from 'axios';

const baseURL = 'http://192.168.1.29:7071/api';


const login = `${baseURL}/LoginUser`;

export const loginUser = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(login, { ...params })
      .then((data: any) => resolve(data.data.data))
      .catch((e) => reject(e));
  });
};