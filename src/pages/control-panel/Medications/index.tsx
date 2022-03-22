import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddMedication from './AddMedication';
import ShowMedication from './ShowMedication';
import ViewMedication from './ViewMedication';

const index = (props: any) => {
  return (
    <Routes>
      <Route path="/" element={<ShowMedication />} />
      <Route path="/add/*" element={<AddMedication />} />
      <Route path="/add/:selectedTime" element={<AddMedication />} />
      <Route
        path="/view/:selectedTime"
        element={<ViewMedication {...props} />}
      />
      {/* <Route
        path="/add/"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
    </Routes>
  );
};

export default index;
