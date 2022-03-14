import { createContext } from 'react';

const AppContext = createContext<{
  chartSelections: Array<string>;
  patient?: any;
  dateTime?: any;
}>({
  chartSelections: new Array<string>(),
});

export default AppContext;
