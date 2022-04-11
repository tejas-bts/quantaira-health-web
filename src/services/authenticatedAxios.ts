import axios from 'axios';
import { User } from '../types/User.type';
import { getCurrentUser } from '../utils/utilities';





const authenticateAxios = () => {
  const user: User = getCurrentUser();
  axios.defaults.headers.common = {
    'Authorization': user.token,
  };
};

const deAuthenticateAxios = () => {
  delete axios.defaults.headers.common['Authorization'];
};

export default axios;
export { authenticateAxios, deAuthenticateAxios };
