import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddMedication from './AddMedication';
import ShowMedication from './ShowMedication';

const index = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowMedication />} />
      <Route path="/add/:selectedTime" element={<AddMedication />} />
      {/* <Route
        path="/add/"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
    </Routes>
  );
};

export default index;
