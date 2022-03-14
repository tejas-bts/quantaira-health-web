import React, { useEffect } from 'react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../contexts/AppContext';

const PatientSelection = () => {
  const appContext = useContext(AppContext);

  useEffect(() => {
    console.log('App Context', appContext);
  }, [appContext]);

  return (
    <div className="chart-grid">
      <div />
      <div>
        <Link to="/app/charts"> </Link>
      </div>
      <div />
      <div />
    </div>
  );
};

export default PatientSelection;
