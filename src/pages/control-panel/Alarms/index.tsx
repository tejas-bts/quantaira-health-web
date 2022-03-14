import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddAlarm from './AddAlarm';
import ShowAlarms from './ShowAlarms';

const index = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowAlarms />} />
      <Route path="/add" element={<AddAlarm />} />
    </Routes>
  );
};

export default index;
