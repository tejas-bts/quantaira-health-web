import axios from 'axios';

const baseURL = 'http://192.168.1.29:7071/api';

const saveNotes = `${baseURL}/AddNotes`;

export const saveNote = async (params: any) => {
  return new Promise<void>((resolve, reject) => {
    axios.post(saveNotes, { ...params })
      .then(() => resolve())
      .catch((e) => reject(e));
  });
};

