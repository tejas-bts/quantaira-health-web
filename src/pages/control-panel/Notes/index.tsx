import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNote from './AddNote';
import ShowNotes from './ShowNotes';

const index = () => {
  return (
    <Routes>
      <Route path="/" element={<ShowNotes />} />
      <Route path="/add/*" element={<AddNote />} />
      <Route path="/add/:selectedTime" element={<AddNote />} />
      {/* <Route
        path="/add"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
    </Routes>
  );
};

export default index;
