import { Time } from 'lightweight-charts';
import { User } from '../types/User.type';

export const timeToLocal = (originalTime: number): Time => {
  const d = new Date(originalTime * 1000);
  const ret: any =
    Date.UTC(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      d.getHours(),
      d.getMinutes(),
      d.getSeconds(),
      d.getMilliseconds()
    ) / 1000;
  return ret;
};

export const localToTime = (time: number): number => {
  return time * 1000 + new Date().getTimezoneOffset() * 60 * 1000;
};

export const debounce = (func: any, timeout = 1000) => {
  let timer: NodeJS.Timeout;
  return (...args: [unknown]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
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

export const isSameArray = (item1: Array<unknown>, item2: Array<unknown>): boolean => {
  if (item1.length != item2.length) return false;
  for (const item of item1) {
    if (!item2.includes(item)) return false;
  }
  return true;
};
