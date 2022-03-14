import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bottom-nav-bar">
      <button
        onClick={() => {
          navigate(
            location.pathname.toLowerCase().includes('charts')
              ? 'kpi'
              : 'charts',
            {
              replace: true,
            }
          );
        }}
      >
        <div
          style={{
            backgroundImage: `url('/images/navbar/${
              location.pathname.toLowerCase().includes('charts')
                ? 'kpi.svg'
                : 'chart.svg'
            }')`,
          }}
        />
        Show{' '}
        {location.pathname.toLowerCase().includes('charts') ? 'KPIs' : 'Charts'}
      </button>

      <button>
        <div
          style={{
            backgroundImage: 'url("/images/navbar/previous-screen.svg")',
          }}
        />
        Previous Screen
      </button>
      <button>
        <div
          style={{ backgroundImage: 'url("/images/navbar/next-screen.svg")' }}
        />
        Next Screen
      </button>
      <button>
        <div
          style={{ backgroundImage: 'url("/images/navbar/lock-screen.svg")' }}
        />
        Lock Screen
      </button>
      <button
        onClick={() => {
          navigate('/app/charts/alarms', {
            replace: true,
          });
        }}
      >
        <div
          style={{ backgroundImage: 'url("/images/navbar/alarm-setup.svg")' }}
        />
        Alarm Setup
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
        <div
          style={{ backgroundImage: 'url("/images/navbar/medication.svg")' }}
        />
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
      <button>
        {/* <div
          style={{ backgroundImage: 'url("/images/navbar/select-graph.svg")' }}
        />
        Select Graph */}
      </button>
      <button>
        {/* <div style={{ backgroundImage: 'url("/images/navbar/setting.svg")' }} /> */}
        {/* Settings */}
      </button>
      <button>
        <div style={{ backgroundImage: 'url("/images/navbar/log-out.svg")' }} />
        Logout
      </button>
    </div>
  );
};

export default BottomNavigationBar;
