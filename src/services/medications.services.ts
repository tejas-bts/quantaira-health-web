import axios from './authenticatedAxios';
import { baseURLhttp } from '../utils/constants';
import { Medication } from '../types/Core.types';
import Analytics from '../utils/Analytics';

const saveMedications = `${baseURLhttp}/AddMedication`;
const getNotesAndMedications = `${baseURLhttp}/FetchNotesMedication`;
const searchAvailableMedicines = `${baseURLhttp}/SearchMedicines`;
const searchAddedMedications = `${baseURLhttp}/SearchNotesMedications`;

export const saveMedication = async (parameters: {
  patientId: string;
  deviceId: string;
  content: string;
  inputTimeStamp: number;
  item: string;
  isNDC: boolean;
}) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .post(saveMedications, {
        pid: parameters.patientId,
        categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D',
        inputTime: parameters.inputTimeStamp,
        item_id: parameters.item,
        ndc: parameters.isNDC,
        content: parameters.content,
        device: parameters.deviceId,
      })
      .then(() => {
        Analytics.track(
          'addnotesmedication',
          JSON.stringify({
            pid: parameters.patientId,
            categoryId: '54AA1262-73DA-49ED-8D96-FD0D2261A16D',
            inputTime: parameters.inputTimeStamp,
            item_id: parameters.item,
            ndc: parameters.isNDC,
            content: parameters.content,
          })
        );
        resolve();
      })
      .catch((e) => reject(e));
  });
};

export const fetchMedications = async (parameters: { patientId: string; deviceId: string }) => {
  return new Promise<Array<Medication> | undefined>((resolve, reject) => {
    axios
      .get(getNotesAndMedications, {
        params: {
          ...parameters,
          input_type_id: 'B5CDC538-BFBF-4E84-A76D-DEDD8D419A35',
          pid: parameters.patientId,
          device: parameters.deviceId,
        },
      })
      .then((response) => {
        Analytics.track('reqmedication', parameters.patientId);
        const medications = response.data.data.map((item: any) => {
          return {
            product: {
              name: item.productName,
              strength: item.strength,
            },
            id: item.row_id,
            timeStamp: item.inputTime,
            author: {
              id: item.createdby,
              name: item.userName,
              role: item.categoryName,
            },
            note: item.inputContent,
          };
        });
        resolve(medications);
      })
      .catch((e) => reject(e));
  });
};

export const searchMedicines = async (searchTerm: string, isNDC: boolean) => {
  return new Promise<void>((resolve, reject) => {
    axios
      .get(searchAvailableMedicines, { params: { searchTerm, ndc: isNDC } })
      .then((response) => {
        Analytics.track('srhmedications', `Keyword : ${searchTerm}`);
        resolve(response.data.data);
      })
      .catch((e) => reject(e));
  });
};

export const searchPatientsMedications = async (patientId: string | number, query: string) => {
  console.log('Query', query);
  return new Promise<Array<Medication> | undefined>((resolve, reject) => {
    axios
      .get(searchAddedMedications, {
        params: { searchType: 'medication', searchTerm: query, pid: patientId },
      })
      .then((response) => {
        const medications = response.data.data.map((item: any) => {
          return {
            product: {
              name: item.productName,
              strength: item.strength,
            },
            id: item.row_id,
            timeStamp: item.inputTime,
            author: {
              id: item.createdby,
              name: item.userName,
              role: item.categoryName,
            },
            note: item.inputContent,
          };
        });
        resolve(medications);
      })
      .catch((e) => reject(e));
  });
};
