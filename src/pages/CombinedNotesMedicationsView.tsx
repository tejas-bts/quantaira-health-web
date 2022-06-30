import { last } from 'lodash';
import React from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import MultiLingualLabel from '../components/core/MultiLingualLabel';
import ShowNotes from './control-panel/Notes/ShowNotes';
import ShowMedications from './control-panel/Medications/ShowMedication';
import ShowAnalytics from './control-panel/Analytics/ShowAnalytics';

const CombinedNotesMedicationsView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathArray = location.pathname.split('/');
  const path = last(pathArray);

  return (
    <div className="d-flex p-3 cv-wrapper overflow-hidden">
      <div className="p-3">
        <div className="d-flex flex-column bottom-nav-bar gap-3">
          <div className="cv-nav-item">
            <button
              onClick={() => {
                navigate('/app/combined/notes', {
                  replace: true,
                });
              }}
              className={path?.includes('notes') ? 'active' : 'null'}
            >
              <div style={{ backgroundImage: 'url("/images/navbar/notes.svg")' }} />
              <MultiLingualLabel id="NOTES" />
            </button>
          </div>
          <div className="cv-nav-item">
            <button
              onClick={() => {
                navigate('/app/combined/medications', {
                  replace: true,
                });
              }}
              className={path?.includes('medications') ? 'active' : 'null'}
            >
              <div style={{ backgroundImage: 'url("/images/navbar/medication.svg")' }} />
              <MultiLingualLabel id="MEDICATION" />
            </button>
          </div>
          <div className="cv-nav-item">
            <button
              onClick={() => {
                navigate('/app/combined/logs', {
                  replace: true,
                });
              }}
              className={path?.includes('analytics') ? 'active' : 'null'}
            >
              <div style={{ backgroundImage: 'url("/images/navbar/combine-view.svg")' }} />
              <MultiLingualLabel id="USER_LOGS" />
            </button>
          </div>
        </div>
      </div>
      <div className="cv-banner overflow-y-scroll p-3 flex-1">
        <Routes>
          <Route path="notes" element={<ShowNotes />} />
          <Route path="medications" element={<ShowMedications />} />
          <Route path="logs" element={<ShowAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default CombinedNotesMedicationsView;
