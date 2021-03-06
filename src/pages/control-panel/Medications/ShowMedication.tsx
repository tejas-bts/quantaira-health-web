import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import Button from '../../../components/core/Button';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import { addToMedications } from '../../../reducers/medications';
import {
  fetchMedications,
  searchPatientsMedications,
} from '../../../services/medications.services';
import { Bed, Medication } from '../../../types/Core.types';

const ShowNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const medications: Array<Medication> = useSelector((state: any) => state.medications.data);
  const bed: Bed = useSelector((state: any) => state.patient.bed);

  useEffect(() => {
    console.log('Bed', bed);
  }, [bed]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm: string = e.target.value;
    try {
      setLoading(true);
      if (searchTerm.length < 3) {
        const medications: any = await fetchMedications({
          patientId: `${bed.patientID}`,
          deviceId: '123',
        });
        dispatch(addToMedications({ medications }));
        return;
      } else {
        const results: Array<Medication> | undefined = await searchPatientsMedications(
          bed.patientID,
          searchTerm
        );
        dispatch(addToMedications({ medications: results }));
        console.log('Results', results);
      }
    } catch (e) {
      console.error('Error', e);
      toast(<MultiLingualLabel id="ERROR_SEARCHING_MEDICATIONS" />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medications !== undefined && medications.length > 0) setLoading(false);
  }, [medications]);

  return (
    <div className="show-notes-page">
      <div className="notes-page-header">
        <input
          className="notes-input-field"
          placeholder="Search medications here"
          onChange={handleChange}
        />
        {/* <Button
          orientation={'vertical'}
          icon="/images/filters-icon.svg"
          size={'lg'}
          type={'secondary'}
          onClick={undefined}
          shape={'rectangular'}
          cssBorder="none"
        /> */}
        <Button
          label={<MultiLingualLabel id="ADD_MEDICATION" />}
          onClick={() => {
            navigate('/app/charts/medications/add', {
              replace: true,
            });
          }}
          icon="/images/notes-icon.svg"
          orientation={'horizontle'}
          size={'lg'}
          type={'primary'}
          shape={'rectangular'}
          cssWidth="14rem"
        />
      </div>

      {loading ? (
        <div className="d-flex flex-1 justify-content-center align-items-center m-9">
          Loading...
        </div>
      ) : (
        <div className="notes-list">
          {medications.length > 0 && <AccordionInDropdown show={true} data={medications} />}
        </div>
      )}
    </div>
  );
};

export default ShowNotes;
