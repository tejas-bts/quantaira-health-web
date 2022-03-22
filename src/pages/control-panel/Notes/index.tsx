import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddNote from './AddNote';
import ShowNotes from './ShowNotes';
import ViewNote from './ViewNote';

const index = (props: any) => {
  return (
    <Routes>
      <Route path="/" element={<ShowNotes />} />
      <Route path="/add/*" element={<AddNote />} />
      <Route path="/add/:selectedTime" element={<AddNote />} />
      <Route path="/view/:noteId" element={<ViewNote {...props} />} />
      {/* <Route
        path="/add"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
    </Routes>
  );
};

export default index;
