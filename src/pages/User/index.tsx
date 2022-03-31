import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Login';
import { IntlProvider } from 'react-intl';
import NewPassword from './NewPassword';
import { useSelector } from 'react-redux';

const index = () => {
  const locale = useSelector((state: any) => state.language.selectedLocale);
  return (
    <IntlProvider locale="en" messages={locale}>
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
    </IntlProvider>
  );
};

export default index;
