import { User } from '../types/User.type';

export const debounce = (func: any, timeout = 1000) => {
  let timer: NodeJS.Timeout;
  return (...args: [unknown]) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
};


export const saveCurrentUser = (userObject: User) => {
  localStorage.setItem('user', JSON.stringify(userObject));
};

export const getCurrentUser = (): User => {
  const userObject: string = localStorage.getItem('user') || '{}';
  const user = JSON.parse(userObject);
  return user;
};