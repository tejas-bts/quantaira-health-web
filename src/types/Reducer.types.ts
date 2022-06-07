import { Bed, Building, Floor, Hospital, Medication, Permission, Room } from './Core.types';
import { BiometricData } from './WebsocketData';

export interface AppStateReducer {
  contentBlur: boolean;
  footerBlur: boolean;
  headerBlur: boolean;
  showSettings: boolean;
}

export interface PatientReducer {
  bed: Bed;
  room: Room;
  floor: Floor;
  building: Building;
  hospital: Hospital;
}

export interface ChartsReducer {
  selectedCharts: Array<Array<any>>;
  selectedScreen: number;
}

export interface BiometricReducer {
  biometricData: Array<BiometricData>;
}

export interface HistoricReducer {
  historicData: Array<BiometricData>;
}

export interface MedicationsReducer {
  data: Array<Medication>;
}

export interface NotesReducer {
  data: Array<NotesReducer>;
}

export interface TimeReducer {
  currentTime: number;
  isLive: boolean;
}

export interface LanguageReducer {
  selectedLanguage: 'English - US' | 'Spanish - US';
  selectedLocale: unknown;
}

export interface AuthReducer {
  loggedIn: boolean;
  permissions: Array<Permission>;
  userName: string;
}

export interface StateReducer {
  auth: AuthReducer;
  patient: PatientReducer;
  notes: NotesReducer;
  medications: MedicationsReducer;
  time: TimeReducer;
  chart: ChartsReducer;
  biometrics: BiometricReducer;
  history: HistoricReducer;
  appState: AppStateReducer;
  language: LanguageReducer;
}
