import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import User from './pages/User';
import store from './store/store';
import { Provider } from 'react-redux';

// console.log('Message', englishUS);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/app/*" element={<App />} />
          <Route path="/user/*" element={<User />} />
          <Route path="/*" element={<User />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
