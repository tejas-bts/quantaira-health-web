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

export const localToTime = (time: Time): number => {
  return (time as number) * 1000 + new Date().getTimezoneOffset() * 60 * 1000;
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

export const getHighlightedText = (text: string, highlight: string): string => {
  // Split on highlight term and include term into parts, ignore case
  if (highlight == undefined || highlight == '' || highlight == ' ' || highlight == '  ')
    return text;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return `<span>${parts
    .map(
      (part, i) =>
        `<span key=${i} style=${
          part.toLowerCase() === highlight.toLowerCase()
            ? 'color:black;background:gold;font-weight:bold;padding-left:3px;padding-right:3px;'
            : ''
        }>${part}</span>`
    )
    .join('')}
    </span>`;
};

export const isNotUndefined = (...args: Array<any>): boolean => {
  for (const item of args) {
    if (item === undefined) return false;
  }
  return true;
};

export const flattenArray = (twoDArray: Array<Array<string>>) => {
  const oneDArray = [];
  for (const arr of twoDArray) {
    for (const item of arr) {
      oneDArray.push(item);
    }
  }
  return oneDArray;
};

export const isTimeInOrder = (data: Array<[number, number]>): boolean => {
  let lastTime = 0;
  for (let i = 0; i < data.length; i++) {
    const currentTime = data[i][0];
    if (currentTime <= lastTime) {
      console.error('Time out of order at', i, data[i - 1], data[i], data[i + 1]);
      return false;
    } else {
      lastTime = currentTime;
    }
  }
  return true;
};
