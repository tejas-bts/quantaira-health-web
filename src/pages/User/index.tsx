import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Login';
import NewPassword from './NewPassword';

const index = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/new-password" element={<NewPassword />} />
        {/* <Route
        path="/add"
        element={<Navigate to={`/add/${new Date().getTime()}`} />}
      /> */}
      </Routes>
    </>
  );
};

export default index;
