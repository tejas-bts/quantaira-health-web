import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { logOut } from '../../reducers/auth';
import { nextScreen, previousScreen } from '../../reducers/charts';

const BottomNavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogOut = () => {
    // Logic for destroying session here
    dispatch(logOut());
    localStorage.clear();
    navigate('/', { replace: true });
  };

  return (
    <div className="bottom-nav-bar">
      <button
        onClick={() => {
          navigate(location.pathname.toLowerCase().includes('charts') ? 'kpi' : 'charts', {
            replace: true,
          });
        }}
      >
        <div
          style={{
            backgroundImage: `url('/images/navbar/${
              location.pathname.toLowerCase().includes('charts') ? 'kpi.svg' : 'chart.svg'
            }')`,
          }}
        />
        Show {location.pathname.toLowerCase().includes('charts') ? 'KPIs' : 'Charts'}
      </button>

      <button onClick={() => dispatch(previousScreen())}>
        <div
          style={{
            backgroundImage: 'url("/images/navbar/previous-screen.svg")',
          }}
        />
        Previous Screen
      </button>
      <button onClick={() => dispatch(nextScreen())}>
        <div style={{ backgroundImage: 'url("/images/navbar/next-screen.svg")' }} />
        Next Screen
      </button>
      <button>
        <div style={{ backgroundImage: 'url("/images/navbar/lock-screen.svg")' }} />
        Lock Screen
      </button>
      <button
        onClick={() => {
          navigate('/app/charts/alarms', {
            replace: true,
          });
        }}
      >
        {/* <div
          style={{ backgroundImage: 'url("/images/navbar/alarm-setup.svg")' }}
        />
        Alarm Setup */}
      </button>
      <button
        onClick={() => {
          navigate('/app/charts/notes', {
            replace: true,
          });
        }}
      >
        <div style={{ backgroundImage: 'url("/images/navbar/notes.svg")' }} />
        Notes
      </button>
      <button
        onClick={() => {
          navigate('/app/charts/medications', {
            replace: true,
          });
        }}
      >
        <div style={{ backgroundImage: 'url("/images/navbar/medication.svg")' }} />
        Medication
      </button>
      <button>
        {/* <div
          style={{ backgroundImage: 'url("/images/navbar/patient-view.svg")' }}
        />
        Patient View */}
      </button>
      <button>
        {/* <div
          style={{ backgroundImage: 'url("/images/navbar/combine-view.svg")' }}
        />
        Combine View */}
      </button>
      <button
        onClick={() => {
          navigate('/app/charts', {
            replace: true,
          });
        }}
      >
        <div style={{ backgroundImage: 'url("/images/navbar/select-graph.svg")' }} />
        Select Graph
      </button>
      <button>
        {/* <div style={{ backgroundImage: 'url("/images/navbar/setting.svg")' }} /> */}
        {/* Settings */}
      </button>
      <button onClick={handleLogOut}>
        <div style={{ backgroundImage: 'url("/images/navbar/log-out.svg")' }} />
        Logout
      </button>
    </div>
  );
};

export default BottomNavigationBar;
