/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import AnalyticsDropdown from '../../../components/core/AnalyticsDropDown';
// import Button from '../../../components/core/Button';
// import ConditionalRender from '../../../components/core/ConditionalRender';
// import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
// import { addToMedications } from '../../../reducers/medications';
import { fetchAnalyticsData } from '../../../services/analytics.services';
// import {
//   fetchMedications,
//   searchPatientsMedications,
// } from '../../../services/medications.services';
// import { Bed, Medication } from '../../../types/Core.types';
// import { userPermissions } from '../../../utils/constants';
import Cookies from 'js-cookie';

const ShowNotes = () => {
  const [loading, setLoading] = useState(true);
  const sessionId: any = Cookies.get('sessionId')
    ? Cookies.get('sessionId')
    : '470B681A-330B-48AE-B4AF-B98D5B5FD4FD';

  const [analyticsData, setAnalyticsData] = useState([]);

  const searchMedications = async () => {
    try {
      setLoading(true);
      const analyticsData: any = await fetchAnalyticsData(sessionId);
      setAnalyticsData(analyticsData);
    } catch (e) {
      console.error('Error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchMedications();
    analyticsData ? console.log('Analytics Data :::::: ', analyticsData) : null;
  }, []);

  return (
    <div className="show-notes-page">
      {loading ? (
        <div className="d-flex flex-1 justify-content-center align-items-center m-9 text-white">
          Loading...
        </div>
      ) : (
        <div className="notes-list overflow-y-scroll mt-1">
          {analyticsData.length > 0 && <AnalyticsDropdown show={true} data={analyticsData} />}
        </div>
      )}
    </div>
  );
};

export default ShowNotes;
