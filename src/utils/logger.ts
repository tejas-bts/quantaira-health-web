export const logBiometricData = (data: any, exclusions: Array<string> = []) => {
  console.clear();
  const processedData: any = {};
  for (const i of data) {

    const label: string = i.label;
    if (exclusions.includes(label)) {
      continue;
    }
    const { values } = i;
    for (const value of values) {
      const time = new Date(value[0]).toLocaleTimeString();
      const reading = value[1];
      if (!processedData[time]) {
        processedData[time] = {};
      }
      const obj = processedData[time];
      obj[i.label] = reading;
    }

  }
  console.table(processedData);
};

export const logData = () => {
  console.log('%cWelcome to Quantaira debug console', 'color:yellow; font-size:20px;text-align:center');
};