import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import User from './pages/user';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/app/*" element={<App />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
