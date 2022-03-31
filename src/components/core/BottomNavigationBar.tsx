import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Settings from '../../pages/control-panel/Settings';
import { hideSettings, showSettings } from '../../reducers/appState';
import { logOut } from '../../reducers/auth';
import { nextScreen, previousScreen } from '../../reducers/charts';
import MultiLingualLabel from './MultiLingualLabel';

const BottomNavigationBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const settingsShown = useSelector((state: any) => state.appState.showSettings);

  const handleLogOut = () => {
    // Logic for destroying session here
    dispatch(logOut());
    localStorage.clear();
    navigate('/', { replace: true });
  };

  const handleSettings = () => {
    console.log('showSettings', settingsShown);
    if (settingsShown) {
      dispatch(hideSettings());
    } else {
      dispatch(showSettings());
    }
  };

  return (
    <div className="bottom-nav-bar">
      <div className="bottom-nav-item">
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
          {location.pathname.toLowerCase().includes('charts') ? (
            <MultiLingualLabel id="SHOW_KPI" />
          ) : (
            <MultiLingualLabel id="SHOW_CHARTS" />
          )}
        </button>
      </div>
      <div className="bottom-nav-item">
        <button onClick={() => dispatch(previousScreen())}>
          <div
            style={{
              backgroundImage: 'url("/images/navbar/previous-screen.svg")',
            }}
          />
          <MultiLingualLabel id="PREV_SCREEN" />
        </button>
      </div>
      <div className="bottom-nav-item">
        <button onClick={() => dispatch(nextScreen())}>
          <div style={{ backgroundImage: 'url("/images/navbar/next-screen.svg")' }} />
          <MultiLingualLabel id="NEXT_SCREEN" />
        </button>
      </div>
      <div className="bottom-nav-item">
        <button>
          <div style={{ backgroundImage: 'url("/images/navbar/lock-screen.svg")' }} />
          <MultiLingualLabel id="LOCK_SCREEN" />
        </button>
      </div>
      <div className="bottom-nav-item">
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
      </div>
      <div className="bottom-nav-item">
        <button
          onClick={() => {
            navigate('/app/charts/notes', {
              replace: true,
            });
          }}
        >
          <div style={{ backgroundImage: 'url("/images/navbar/notes.svg")' }} />
          <MultiLingualLabel id="NOTES" />
        </button>
      </div>
      <div className="bottom-nav-item">
        <button
          onClick={() => {
            navigate('/app/charts/medications', {
              replace: true,
            });
          }}
        >
          <div style={{ backgroundImage: 'url("/images/navbar/medication.svg")' }} />
          <MultiLingualLabel id="MEDICATION" />
        </button>
      </div>
      <div className="bottom-nav-item">
        <button>
          {/* <div
          style={{ backgroundImage: 'url("/images/navbar/patient-view.svg")' }}
        />
        Patient View */}
        </button>
      </div>
      <div className="bottom-nav-item">
        <button>
          {/* <div
          style={{ backgroundImage: 'url("/images/navbar/combine-view.svg")' }}
        />
        Combine View */}
        </button>
      </div>
      <div className="bottom-nav-item">
        <button
          onClick={() => {
            navigate('/app/charts', {
              replace: true,
            });
          }}
        >
          <div style={{ backgroundImage: 'url("/images/navbar/select-graph.svg")' }} />
          <MultiLingualLabel id="SELECT_GRAPH" />
        </button>
      </div>
      <div className="bottom-nav-item">
        {settingsShown && <Settings />}
        <button onClick={handleSettings}>
          <div style={{ backgroundImage: 'url("/images/navbar/setting.svg")' }} />
          <MultiLingualLabel id="SETTINGS" />
        </button>
      </div>
      <div className="bottom-nav-item">
        <button onClick={handleLogOut}>
          <div style={{ backgroundImage: 'url("/images/navbar/log-out.svg")' }} />
          <MultiLingualLabel id="LOG_OUT" />
        </button>
      </div>
    </div>
  );
};

export default BottomNavigationBar;
