import './styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';
import User from './pages/User';
import Test from './pages/Tests';
import store from './store/store';
import { Provider } from 'react-redux';


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/app/*" element={<App />} />
          <Route path="/user/*" element={<User />} />
          <Route path="/test/*" element={<Test />} />
          <Route path="/*" element={<User />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
