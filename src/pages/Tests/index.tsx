import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import TestChart from './TestChart';

const index = () => {
  const locale = useSelector((state: any) => state.language.selectedLocale);
  return (
    <IntlProvider locale="en" messages={locale}>
      <Routes>
        <Route path="/" element={<TestChart />} />
      </Routes>
    </IntlProvider>
  );
};

export default index;
