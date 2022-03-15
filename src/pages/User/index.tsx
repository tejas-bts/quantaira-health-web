import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import NewPassword from './NewPassword';

const index = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/new-password" element={<NewPassword />} />
      {/* <Route
        path="/add"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
    </Routes>
  );
};

export default index;
