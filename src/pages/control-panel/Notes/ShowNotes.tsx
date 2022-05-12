import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AccordionInDropdown from '../../../components/core/AccordionInDropdown';
import Button from '../../../components/core/Button';
import MultiLingualLabel from '../../../components/core/MultiLingualLabel';
import { addToNotes } from '../../../reducers/notes';
import { fetchNotes, searchPatientsNotes } from '../../../services/notes.services';
import { Bed, Note } from '../../../types/Core.types';

const ShowNotes = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const notes: Array<Note> = useSelector((state: any) => state.notes.data);
  const bed: Bed = useSelector((state: any) => state.patient.bed);

  useEffect(() => {
    if (notes !== undefined) setLoading(false);
  }, [notes]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm: string = e.target.value;
    try {
      setLoading(true);
      if (searchTerm.length < 3) {
        const notes: Array<Note> | undefined = await fetchNotes({
          patientId: `${bed.patientID}`,
          deviceId: '123',
        });
        dispatch(addToNotes({ notes }));
        return;
      } else {
        const results: Array<Note> | undefined = await searchPatientsNotes(
          bed.patientID,
          searchTerm
        );
        dispatch(addToNotes({ notes: results ? results : [] }));
        console.log('Results', results);
      }
    } catch (e) {
      console.error('Error', e);
      toast(<MultiLingualLabel id="ERROR_SEARCHING_NOTES" />);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="show-notes-page">
      <div className="notes-page-header">
        <input
          className="notes-input-field"
          placeholder="Search notes here"
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
          label={<MultiLingualLabel id="ADD_NOTES" />}
          onClick={() => {
            navigate('/app/charts/notes/add', {
              replace: true,
            });
          }}
          icon="/images/notes-icon.svg"
          orientation={'horizontle'}
          size={'lg'}
          type={'primary'}
          shape={'rectangular'}
          cssWidth="12rem"
        />
      </div>
      {loading ? (
        <div className="d-flex flex-1 justify-content-center align-items-center m-9">
          Loading...
        </div>
      ) : (
        <div className="notes-list">
          {notes.length > 0 && <AccordionInDropdown show={true} data={notes} />}
        </div>
      )}
    </div>
  );
};

export default ShowNotes;
